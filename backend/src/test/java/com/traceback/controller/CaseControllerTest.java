package com.traceback.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class CaseControllerTest {

    @DynamicPropertySource
    static void overrideDatasource(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", () -> "jdbc:h2:mem:casetest;MODE=MySQL;DB_CLOSE_DELAY=-1");
        registry.add("spring.datasource.driver-class-name", () -> "org.h2.Driver");
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
        registry.add("spring.jpa.properties.hibernate.dialect", () -> "org.hibernate.dialect.H2Dialect");
        registry.add("spring.flyway.enabled", () -> "false");
        registry.add("app.rate-limit.auth-limit", () -> "1000");
        registry.add("app.rate-limit.case-limit", () -> "1000");
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String policeToken;

    @BeforeEach
    void setUpPoliceAccount() throws Exception {
        Map<String, String> body = Map.of(
                "name", "Officer Case Test",
                "email", "officer.case.test." + System.nanoTime() + "@example.com",
                "password", "password123",
                "role", "police"
        );
        String response = mockMvc.perform(post("/api/auth/register")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(body)))
                .andReturn().getResponse().getContentAsString();

        policeToken = objectMapper.readTree(response).get("token").asText();
    }

    private Map<String, Object> sampleMissingPersonPayload() {
        Map<String, Object> payload = new HashMap<>();
        payload.put("case_type", "missing_person");
        payload.put("full_name", "Test Person " + System.nanoTime());
        payload.put("age", 25);
        payload.put("gender", "Male");
        payload.put("last_seen_location", "Test Location");
        payload.put("last_seen_date", "2025-08-01");
        payload.put("reporter_name", "Test Reporter");
        payload.put("reporter_phone", "9999999999");
        return payload;
    }

    @Test
    void createCase_anonymously_succeedsAndReturnsReportNumber() throws Exception {
        mockMvc.perform(post("/api/cases")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(sampleMissingPersonPayload())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.report_number").exists())
                .andExpect(jsonPath("$.data.status").value("missing"));
    }

    @Test
    void createCase_withoutFullName_returns400() throws Exception {
        Map<String, Object> payload = sampleMissingPersonPayload();
        payload.remove("full_name");

        mockMvc.perform(post("/api/cases")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void listCases_isPublic_andFiltersByStatus() throws Exception {
        mockMvc.perform(post("/api/cases")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(sampleMissingPersonPayload())));

        mockMvc.perform(get("/api/cases").param("status", "missing"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    void listCases_withPagination_returnsPagedShape() throws Exception {
        for (int i = 0; i < 3; i++) {
            mockMvc.perform(post("/api/cases")
                    .contentType("application/json")
                    .content(objectMapper.writeValueAsString(sampleMissingPersonPayload())));
        }

        mockMvc.perform(get("/api/cases").param("page", "0").param("size", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items").isArray())
                .andExpect(jsonPath("$.data.size").value(2))
                .andExpect(jsonPath("$.data.page").value(0));
    }

    @Test
    void updateStatus_withoutAuth_isForbidden() throws Exception {
        String response = mockMvc.perform(post("/api/cases")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(sampleMissingPersonPayload())))
                .andReturn().getResponse().getContentAsString();
        String id = objectMapper.readTree(response).get("data").get("id").asText();

        mockMvc.perform(patch("/api/cases/" + id + "/status")
                        .contentType("application/json")
                        .content("{\"status\":\"found\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void updateStatus_asPolice_succeeds() throws Exception {
        String response = mockMvc.perform(post("/api/cases")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(sampleMissingPersonPayload())))
                .andReturn().getResponse().getContentAsString();
        String id = objectMapper.readTree(response).get("data").get("id").asText();

        mockMvc.perform(patch("/api/cases/" + id + "/status")
                        .header("Authorization", "Bearer " + policeToken)
                        .contentType("application/json")
                        .content("{\"status\":\"found\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("found"));
    }

    @Test
    void deleteCase_asPolice_succeeds_thenGetReturns404() throws Exception {
        String response = mockMvc.perform(post("/api/cases")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(sampleMissingPersonPayload())))
                .andReturn().getResponse().getContentAsString();
        String id = objectMapper.readTree(response).get("data").get("id").asText();

        mockMvc.perform(delete("/api/cases/" + id)
                        .header("Authorization", "Bearer " + policeToken))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/cases/" + id))
                .andExpect(status().isNotFound());
    }

    @Test
    void stats_returnsCounts() throws Exception {
        mockMvc.perform(get("/api/cases/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.total").exists())
                .andExpect(jsonPath("$.data.missing").exists());
    }
}
