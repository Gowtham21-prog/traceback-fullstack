package com.traceback.security;

public record AuthenticatedUser(Long id, String email, String role) {

    public boolean isPolice() {
        return "police".equalsIgnoreCase(role) || "admin".equalsIgnoreCase(role);
    }
}
