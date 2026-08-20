package com.traceback.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.traceback.entity.Case;
import lombok.Builder;
import lombok.Data;

import java.time.format.DateTimeFormatter;

@Data
@Builder
public class CaseResponse {

    private String id;

    @JsonProperty("report_number")
    private String reportNumber;

    @JsonProperty("case_type")
    private String caseType;

    @JsonProperty("full_name")
    private String fullName;

    private Integer age;
    private String gender;
    private String dob;

    @JsonProperty("blood_group")
    private String bloodGroup;

    private String photo;
    private String status;

    private String height;
    private String weight;
    @JsonProperty("eye_color")
    private String eyeColor;
    @JsonProperty("hair_color")
    private String hairColor;
    private String complexion;
    private String build;
    @JsonProperty("identifying_marks")
    private String identifyingMarks;
    private String medical;

    @JsonProperty("last_seen_location")
    private String lastSeenLocation;
    @JsonProperty("last_seen_date")
    private String lastSeenDate;
    @JsonProperty("last_seen_time")
    private String lastSeenTime;
    @JsonProperty("last_seen_wearing")
    private String lastSeenWearing;
    private String places;
    private String description;

    @JsonProperty("incident_date")
    private String incidentDate;
    @JsonProperty("incident_time")
    private String incidentTime;
    @JsonProperty("incident_location")
    private String incidentLocation;
    @JsonProperty("incident_description")
    private String incidentDescription;

    @JsonProperty("item_description")
    private String itemDescription;
    @JsonProperty("item_serial")
    private String itemSerial;
    @JsonProperty("item_value")
    private String itemValue;

    @JsonProperty("vehicle_number")
    private String vehicleNumber;
    @JsonProperty("vehicle_type")
    private String vehicleType;
    @JsonProperty("vehicle_model")
    private String vehicleModel;

    @JsonProperty("suspect_description")
    private String suspectDescription;

    @JsonProperty("reporter_name")
    private String reporterName;
    @JsonProperty("reporter_phone")
    private String reporterPhone;
    @JsonProperty("reporter_phone2")
    private String reporterPhone2;
    @JsonProperty("reporter_relation")
    private String reporterRelation;
    @JsonProperty("reporter_email")
    private String reporterEmail;
    @JsonProperty("reporter_address")
    private String reporterAddress;

    @JsonProperty("police_station")
    private String policeStation;
    @JsonProperty("police_email")
    private String policeEmail;
    @JsonProperty("police_phone")
    private String policePhone;

    @JsonProperty("created_at")
    private String createdAt;

    @JsonProperty("updated_at")
    private String updatedAt;

    public static CaseResponse from(Case c) {
        DateTimeFormatter iso = DateTimeFormatter.ISO_DATE_TIME;
        return CaseResponse.builder()
                .id(String.valueOf(c.getId()))
                .reportNumber(c.getReportNumber())
                .caseType(c.getCaseType())
                .fullName(c.getFullName())
                .age(c.getAge())
                .gender(c.getGender())
                .dob(c.getDob())
                .bloodGroup(c.getBloodGroup())
                .photo(c.getPhoto())
                .status(c.getStatus())
                .height(c.getHeight())
                .weight(c.getWeight())
                .eyeColor(c.getEyeColor())
                .hairColor(c.getHairColor())
                .complexion(c.getComplexion())
                .build(c.getBuild())
                .identifyingMarks(c.getIdentifyingMarks())
                .medical(c.getMedical())
                .lastSeenLocation(c.getLastSeenLocation())
                .lastSeenDate(c.getLastSeenDate())
                .lastSeenTime(c.getLastSeenTime())
                .lastSeenWearing(c.getLastSeenWearing())
                .places(c.getPlaces())
                .description(c.getDescription())
                .incidentDate(c.getIncidentDate())
                .incidentTime(c.getIncidentTime())
                .incidentLocation(c.getIncidentLocation())
                .incidentDescription(c.getIncidentDescription())
                .itemDescription(c.getItemDescription())
                .itemSerial(c.getItemSerial())
                .itemValue(c.getItemValue())
                .vehicleNumber(c.getVehicleNumber())
                .vehicleType(c.getVehicleType())
                .vehicleModel(c.getVehicleModel())
                .suspectDescription(c.getSuspectDescription())
                .reporterName(c.getReporterName())
                .reporterPhone(c.getReporterPhone())
                .reporterPhone2(c.getReporterPhone2())
                .reporterRelation(c.getReporterRelation())
                .reporterEmail(c.getReporterEmail())
                .reporterAddress(c.getReporterAddress())
                .policeStation(c.getPoliceStation())
                .policeEmail(c.getPoliceEmail())
                .policePhone(c.getPolicePhone())
                .createdAt(c.getCreatedAt() != null ? c.getCreatedAt().format(iso) : null)
                .updatedAt(c.getUpdatedAt() != null ? c.getUpdatedAt().format(iso) : null)
                .build();
    }
}
