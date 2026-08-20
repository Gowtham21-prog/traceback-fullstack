package com.traceback;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

/**
 * Verifies the Spring context wires up correctly (JPA entities, security
 * filter chain, controllers, JWT beans, etc.) against an in-memory H2
 * database so it doesn't require a real MySQL instance to run in CI.
 *
 * Uses the "dev" profile so JwtSecretEnvironmentPostProcessor auto-generates
 * a throwaway signing secret instead of failing the test run for lack of a
 * JWT_SECRET env var (see that class for why the check exists at all).
 */
@SpringBootTest
@ActiveProfiles("dev")
class TracebackBackendApplicationTests {

    @DynamicPropertySource
    static void overrideDatasource(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", () -> "jdbc:h2:mem:testdb;MODE=MySQL;DB_CLOSE_DELAY=-1");
        registry.add("spring.datasource.driver-class-name", () -> "org.h2.Driver");
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
        registry.add("spring.jpa.properties.hibernate.dialect", () -> "org.hibernate.dialect.H2Dialect");
        registry.add("spring.flyway.enabled", () -> "false");
    }

    @Test
    void contextLoads() {
        // If the application context fails to start, this test fails.
    }
}
