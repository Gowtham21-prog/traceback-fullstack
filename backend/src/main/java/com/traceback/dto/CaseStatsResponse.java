package com.traceback.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CaseStatsResponse {
    private long total;
    private long missing;
    private long found;
    private long investigating;
    private long today;
    private List<Object> districts;
    private List<Object> ageGroups;
    private List<Object> monthly;
}
