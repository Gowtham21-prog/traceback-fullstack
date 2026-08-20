package com.traceback.config;

import com.traceback.entity.Case;
import com.traceback.entity.User;
import com.traceback.repository.CaseRepository;
import com.traceback.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Populates a handful of demo cases and a default police login on first run,
 * mirroring src/data/mockCases.js on the frontend so the app isn't empty
 * out of the box. Safe to delete this file once you have real data.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CaseRepository caseRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedCases();
    }

    private void seedUsers() {
        if (userRepository.count() > 0) return;

        userRepository.save(User.builder()
                .name("Demo Officer")
                .email("police@traceback.demo")
                .password(passwordEncoder.encode("police123"))
                .role("police")
                .build());

        userRepository.save(User.builder()
                .name("Demo Reporter")
                .email("reporter@traceback.demo")
                .password(passwordEncoder.encode("reporter123"))
                .role("reporter")
                .build());
    }

    private void seedCases() {
        if (caseRepository.count() > 0) return;

        save("TB-202507-0001", "missing_person", "Karthik Rajan", 28, "Male", "missing",
                "Adyar Bridge, Chennai", "2025-07-14", "Rajan Kumar", "9876543210", "Father",
                "Adyar PS, Chennai", LocalDateTime.of(2025, 7, 14, 21, 45));

        save("TB-202507-0002", "missing_person", "Divya Krishnan", 14, "Female", "missing",
                "Anna Nagar 3rd Street, Chennai", "2025-07-16", "Krishnan P", "9765432109", "Father",
                "Anna Nagar PS, Chennai", LocalDateTime.of(2025, 7, 16, 18, 0));

        save("TB-202508-0003", "missing_person", "Anbarasu Selvam", 19, "Male", "investigating",
                "Koothapakkam, Cuddalore", "2025-08-08", "Selvam R", "9843210987", "Brother",
                "Salem PS", LocalDateTime.of(2025, 8, 8, 10, 12));

        save("TB-202507-0004", "missing_person", "Kadaamurugan V", 61, "Male", "found",
                "Gandhipuram, Coimbatore", "2025-07-02", "Muthu K", "9812345670", "Son",
                "Coimbatore Central PS", LocalDateTime.of(2025, 7, 2, 8, 30));

        save("TB-202508-0005", "missing_person", "Mohamed Farook", 34, "Male", "missing",
                "RS Puram, Coimbatore", "2025-08-10", "Farook Ahmed", "9898989898", "Brother",
                "Coimbatore Central PS", LocalDateTime.of(2025, 8, 10, 14, 5));
    }

    private void save(String reportNumber, String caseType, String fullName, int age, String gender, String status,
                       String lastSeenLocation, String lastSeenDate, String reporterName, String reporterPhone,
                       String reporterRelation, String policeStation, LocalDateTime createdAt) {
        Case c = Case.builder()
                .reportNumber(reportNumber)
                .caseType(caseType)
                .fullName(fullName)
                .age(age)
                .gender(gender)
                .status(status)
                .lastSeenLocation(lastSeenLocation)
                .lastSeenDate(lastSeenDate)
                .reporterName(reporterName)
                .reporterPhone(reporterPhone)
                .reporterRelation(reporterRelation)
                .policeStation(policeStation)
                .build();
        c = caseRepository.save(c);
        // createdAt is set by @PrePersist; overwrite afterwards for realistic demo timestamps
        c.setCreatedAt(createdAt);
        c.setUpdatedAt(createdAt);
        caseRepository.save(c);
    }
}
