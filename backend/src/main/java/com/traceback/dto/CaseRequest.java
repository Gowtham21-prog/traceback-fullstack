package com.traceback.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * Mirrors the payload shapes built in the frontend's src/pages/Report.jsx
 * (both the missing-person flow and the general complaint flow post to the
 * same POST /api/cases endpoint with a superset of these fields).
 */
@Data
public class CaseRequest {

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

    // physical description
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

    // last seen (missing person)
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

    // incident (general complaint)
    @JsonProperty("incident_date")
    private String incidentDate;
    @JsonProperty("incident_time")
    private String incidentTime;
    @JsonProperty("incident_location")
    private String incidentLocation;
    @JsonProperty("incident_description")
    private String incidentDescription;

    // item / theft
    @JsonProperty("item_description")
    private String itemDescription;
    @JsonProperty("item_serial")
    private String itemSerial;
    @JsonProperty("item_value")
    private String itemValue;

    // vehicle
    @JsonProperty("vehicle_number")
    private String vehicleNumber;
    @JsonProperty("vehicle_type")
    private String vehicleType;
    @JsonProperty("vehicle_model")
    private String vehicleModel;

    // suspect
    @JsonProperty("suspect_description")
    private String suspectDescription;

    // reporter
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

    // police station
    @JsonProperty("police_station")
    private String policeStation;
    @JsonProperty("police_email")
    private String policeEmail;
    @JsonProperty("police_phone")
    private String policePhone;
}
