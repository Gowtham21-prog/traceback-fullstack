package com.traceback.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

/**
 * Validates app.jwt.secret BEFORE any bean (including JwtUtil, which reads
 * it via @Value) is constructed. This runs during environment preparation,
 * ahead of the application context — the only point at which it's safe to
 * inject a generated value and have every @Value-annotated field see it.
 *
 * Registered via META-INF/spring.factories (see that file for wiring).
 */
public class JwtSecretEnvironmentPostProcessor implements EnvironmentPostProcessor {

    private static final int MIN_SECRET_LENGTH = 32;
    private static final String PROP = "app.jwt.secret";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String secret = environment.getProperty(PROP);
        boolean isDevProfile = Arrays.asList(environment.getActiveProfiles()).contains("dev");

        if (secret == null || secret.isBlank()) {
            if (isDevProfile) {
                String generated = generateRandomSecret();
                Map<String, Object> overrides = new HashMap<>();
                overrides.put(PROP, generated);
                environment.getPropertySources().addFirst(new MapPropertySource("jwtSecretGenerated", overrides));
                System.out.println("[JwtSecretEnvironmentPostProcessor] No JWT_SECRET set — generated a temporary " +
                        "one for the 'dev' profile (won't survive a restart). Set JWT_SECRET explicitly before " +
                        "deploying anywhere real.");
                return;
            }
            throw new IllegalStateException(
                    "JWT_SECRET is not set. Set the JWT_SECRET environment variable to a random string of at " +
                    "least " + MIN_SECRET_LENGTH + " characters before starting the app. (Run with " +
                    "--spring.profiles.active=dev, or SPRING_PROFILES_ACTIVE=dev, to auto-generate one for local " +
                    "development only — never in production.)"
            );
        }

        if (secret.length() < MIN_SECRET_LENGTH) {
            throw new IllegalStateException(
                    "JWT_SECRET is too short (" + secret.length() + " chars). It must be at least " +
                    MIN_SECRET_LENGTH + " characters for HS256 signing."
            );
        }
    }

    private String generateRandomSecret() {
        byte[] bytes = new byte[48];
        new SecureRandom().nextBytes(bytes);
        return Base64.getEncoder().encodeToString(bytes);
    }
}
