-- V2: indexes for the filters/search the frontend actually uses
-- (status filter, case_type filter, free-text search, stats-by-day, listing order)

CREATE INDEX idx_cases_status ON cases (status);
CREATE INDEX idx_cases_case_type ON cases (case_type);
CREATE INDEX idx_cases_created_at ON cases (created_at);
CREATE INDEX idx_cases_full_name ON cases (full_name);
CREATE INDEX idx_cases_last_seen_location ON cases (last_seen_location);
CREATE INDEX idx_users_email ON users (email);
