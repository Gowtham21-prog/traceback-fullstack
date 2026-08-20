package com.traceback.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Lightweight in-memory rate limiter, scoped to the endpoints most exposed
 * to abuse: login/register (brute-force risk) and case filing (spam risk,
 * since POST /api/cases is intentionally public/anonymous).
 *
 * This is a fixed-window counter per client IP, reset every WINDOW_MS.
 * It is process-local — fine for a single instance, but won't coordinate
 * across multiple app instances behind a load balancer. Swap for a
 * Redis-backed limiter (e.g. Bucket4j + Redis) if you scale horizontally.
 *
 * NOT annotated with @Component — see JwtAuthFilter for why. This is
 * constructed once as a @Bean by SecurityConfig and wired into the
 * security chain only, so it can't be auto-registered a second time as a
 * container-level filter and end up running twice per request.
 */
public class RateLimitFilter extends OncePerRequestFilter {

    private final long windowMs;
    private final int authLimit;
    private final int caseLimit;

    private final ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<>();

    public RateLimitFilter(long windowMs, int authLimit, int caseLimit) {
        this.windowMs = windowMs;
        this.authLimit = authLimit;
        this.caseLimit = caseLimit;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                     @NonNull HttpServletResponse response,
                                     @NonNull FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        Integer limit = null;
        if (path.startsWith("/api/auth/login") || path.startsWith("/api/auth/register")) {
            limit = authLimit;
        } else if ("POST".equalsIgnoreCase(method) && path.equals("/api/cases")) {
            limit = caseLimit;
        }

        if (limit != null) {
            String key = clientIp(request) + "|" + path;
            Bucket bucket = buckets.computeIfAbsent(key, k -> new Bucket());

            long now = System.currentTimeMillis();
            synchronized (bucket) {
                if (now - bucket.windowStart > windowMs) {
                    bucket.windowStart = now;
                    bucket.count.set(0);
                }
                int current = bucket.count.incrementAndGet();
                if (current > limit) {
                    response.setStatus(429);
                    response.setContentType("application/json");
                    response.getWriter().write(
                            "{\"success\":false,\"message\":\"Too many requests. Please try again in a minute.\"}"
                    );
                    return;
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    private String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private static class Bucket {
        volatile long windowStart = System.currentTimeMillis();
        final AtomicInteger count = new AtomicInteger(0);
    }
}
