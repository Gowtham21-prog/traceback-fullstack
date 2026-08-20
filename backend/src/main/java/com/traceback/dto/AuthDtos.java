package com.traceback.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

public class AuthDtos {

    @Data
    public static class LoginRequest {
        @NotBlank
        @Email
        private String email;

        @NotBlank
        private String password;
    }

    @Data
    public static class RegisterRequest {
        @NotBlank
        private String name;

        @NotBlank
        @Email
        private String email;

        @NotBlank
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        /** reporter | police — defaults to reporter if omitted */
        private String role;
    }

    @Data
    @Builder
    public static class UserSummary {
        private String id;
        private String name;
        private String email;
        private String role;
    }

    @Data
    @Builder
    public static class AuthResponse {
        private boolean success;
        private String token;
        private UserSummary user;
        private String message;
    }
}
