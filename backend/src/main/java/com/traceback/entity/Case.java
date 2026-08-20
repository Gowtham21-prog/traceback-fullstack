package com.traceback.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "cases")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Case {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "report_number", nullable = false, unique = true, length = 40)
    private String reportNumber;

    /** missing_person | mobile_theft | chain_snatching | vehicle_theft | robbery |
     *  cybercrime | burglary | assault | found_person | other */
    @Column(name = "case_type", nullable = false, length = 30)
    private String caseType;

    @Column(name = "full_name", length = 150)
    private String fullName;

    private Integer age;

    @Column(length = 20)
    private String gender;

    @Column(length = 20)
    private String dob;

    @Column(name = "blood_group", length = 10)
    private String bloodGroup;

    /** Stored as base64 data URL for now — swap for a file/S3 URL in production. */
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String photo;

    /** missing | investigating | found (also: closed / recovered reserved for future use) */
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "missing";

    // ── Missing person: physical description ──
    @Column(length = 30)
    private String height;
    @Column(length = 30)
    private String weight;
    @Column(name = "eye_color", length = 30)
    private String eyeColor;
    @Column(name = "hair_color", length = 30)
    private String hairColor;
    @Column(length = 30)
    private String complexion;
    @Column(length = 30)
    private String build;
    @Lob
    @Column(name = "identifying_marks", columnDefinition = "TEXT")
    private String identifyingMarks;
    @Lob
    @Column(columnDefinition = "TEXT")
    private String medical;

    // ── Missing person: last seen ──
    @Column(name = "last_seen_location", length = 255)
    private String lastSeenLocation;
    @Column(name = "last_seen_date", length = 20)
    private String lastSeenDate;
    @Column(name = "last_seen_time", length = 10)
    private String lastSeenTime;
    @Column(name = "last_seen_wearing", length = 255)
    private String lastSeenWearing;
    @Lob
    @Column(columnDefinition = "TEXT")
    private String places;
    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    // ── General complaint: incident details ──
    @Column(name = "incident_date", length = 20)
    private String incidentDate;
    @Column(name = "incident_time", length = 10)
    private String incidentTime;
    @Column(name = "incident_location", length = 255)
    private String incidentLocation;
    @Lob
    @Column(name = "incident_description", columnDefinition = "TEXT")
    private String incidentDescription;

    // ── General complaint: item / theft details ──
    @Column(name = "item_description", length = 255)
    private String itemDescription;
    @Column(name = "item_serial", length = 100)
    private String itemSerial;
    @Column(name = "item_value", length = 30)
    private String itemValue;

    // ── General complaint: vehicle details ──
    @Column(name = "vehicle_number", length = 30)
    private String vehicleNumber;
    @Column(name = "vehicle_type", length = 60)
    private String vehicleType;
    @Column(name = "vehicle_model", length = 100)
    private String vehicleModel;

    // ── General complaint: suspect ──
    @Lob
    @Column(name = "suspect_description", columnDefinition = "TEXT")
    private String suspectDescription;

    // ── Reporter / complainant ──
    @Column(name = "reporter_name", length = 150)
    private String reporterName;
    @Column(name = "reporter_phone", length = 20)
    private String reporterPhone;
    @Column(name = "reporter_phone2", length = 20)
    private String reporterPhone2;
    @Column(name = "reporter_relation", length = 40)
    private String reporterRelation;
    @Column(name = "reporter_email", length = 160)
    private String reporterEmail;
    @Column(name = "reporter_address", length = 255)
    private String reporterAddress;

    // ── Police station routed to ──
    @Column(name = "police_station", length = 150)
    private String policeStation;
    @Column(name = "police_email", length = 160)
    private String policeEmail;
    @Column(name = "police_phone", length = 20)
    private String policePhone;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
        if (this.status == null) this.status = "missing";
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
