-- V1: initial schema for users and cases

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'reporter',
    created_at DATETIME NOT NULL,
    CONSTRAINT uq_users_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE cases (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    report_number VARCHAR(40) NOT NULL,
    case_type VARCHAR(30) NOT NULL,
    full_name VARCHAR(150),
    age INT,
    gender VARCHAR(20),
    dob VARCHAR(20),
    blood_group VARCHAR(10),
    photo LONGTEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'missing',

    height VARCHAR(30),
    weight VARCHAR(30),
    eye_color VARCHAR(30),
    hair_color VARCHAR(30),
    complexion VARCHAR(30),
    build VARCHAR(30),
    identifying_marks TEXT,
    medical TEXT,

    last_seen_location VARCHAR(255),
    last_seen_date VARCHAR(20),
    last_seen_time VARCHAR(10),
    last_seen_wearing VARCHAR(255),
    places TEXT,
    description TEXT,

    incident_date VARCHAR(20),
    incident_time VARCHAR(10),
    incident_location VARCHAR(255),
    incident_description TEXT,

    item_description VARCHAR(255),
    item_serial VARCHAR(100),
    item_value VARCHAR(30),

    vehicle_number VARCHAR(30),
    vehicle_type VARCHAR(60),
    vehicle_model VARCHAR(100),

    suspect_description TEXT,

    reporter_name VARCHAR(150),
    reporter_phone VARCHAR(20),
    reporter_phone2 VARCHAR(20),
    reporter_relation VARCHAR(40),
    reporter_email VARCHAR(160),
    reporter_address VARCHAR(255),

    police_station VARCHAR(150),
    police_email VARCHAR(160),
    police_phone VARCHAR(20),

    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,

    CONSTRAINT uq_cases_report_number UNIQUE (report_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
