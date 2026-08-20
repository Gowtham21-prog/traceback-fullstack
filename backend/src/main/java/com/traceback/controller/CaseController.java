package com.traceback.controller;

import com.traceback.dto.*;
import com.traceback.service.CaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cases")
@RequiredArgsConstructor
public class CaseController {

    private final CaseService caseService;

    /**
     * GET /api/cases?status=&case_type=&q=&page=&size=
     *
     * Backward compatible: if `page`/`size` are omitted, returns the full
     * matching list under `data` exactly like before (what the current
     * frontend's fetchCases() expects). Pass `page`/`size` to opt into a
     * paginated response instead — `data` becomes a PagedResponse object
     * with `items`, `total_items`, `total_pages`, etc.
     */
    @GetMapping
    public ApiResponse<?> list(
            @RequestParam(required = false) String status,
            @RequestParam(name = "case_type", required = false) String caseType,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size
    ) {
        if (page != null || size != null) {
            int p = page != null ? page : 0;
            int s = size != null ? size : 20;
            return ApiResponse.ok(caseService.searchPaged(status, caseType, q, p, s));
        }
        return ApiResponse.ok(caseService.search(status, caseType, q));
    }

    /** GET /api/cases/stats — must be declared before /{id} to avoid path collision */
    @GetMapping("/stats")
    public ApiResponse<CaseStatsResponse> stats() {
        return ApiResponse.ok(caseService.stats());
    }

    @GetMapping("/{id}")
    public ApiResponse<CaseResponse> getOne(@PathVariable Long id) {
        return ApiResponse.ok(caseService.getById(id));
    }

    /** POST /api/cases — intentionally public (anonymous complaint filing), matching original backend behavior */
    @PostMapping
    public ResponseBody create(@RequestBody CaseRequest req) {
        CaseResponse saved = caseService.createCase(req);
        return new ResponseBody(true, saved, saved.getReportNumber());
    }

    /** PATCH /api/cases/{id}/status — police/admin only, enforced in SecurityConfig */
    @PatchMapping("/{id}/status")
    public ApiResponse<CaseResponse> updateStatus(@PathVariable Long id, @Valid @RequestBody StatusUpdateRequest req) {
        return ApiResponse.ok(caseService.updateStatus(id, req.getStatus()));
    }

    /** DELETE /api/cases/{id} — police/admin only, enforced in SecurityConfig */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        caseService.delete(id);
        return ApiResponse.ok(null);
    }

    /**
     * Small local record so createCase's JSON body includes report_number
     * alongside data/success, matching what src/lib/api.js's createCase()
     * reads: res.report_number || res.data?.report_number
     */
    public record ResponseBody(boolean success, CaseResponse data, String report_number) {}
}
