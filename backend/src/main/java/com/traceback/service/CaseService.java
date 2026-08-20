package com.traceback.service;

import com.traceback.dto.CaseRequest;
import com.traceback.dto.CaseResponse;
import com.traceback.dto.CaseStatsResponse;
import com.traceback.dto.PagedResponse;
import com.traceback.entity.Case;
import com.traceback.exception.ApiException;
import com.traceback.repository.CaseRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class CaseService {

    private final CaseRepository caseRepository;

    /**
     * Mirrors createCase() in the frontend's mock layer:
     * TB-YYYYMM-NNNN, e.g. TB-202508-4213
     */
    private String generateReportNumber() {
        LocalDate now = LocalDate.now();
        String prefix = "TB-" + now.format(DateTimeFormatter.ofPattern("yyyyMM")) + "-";
        String candidate;
        do {
            int n = ThreadLocalRandom.current().nextInt(1000, 10000);
            candidate = prefix + n;
        } while (caseRepository.findByReportNumber(candidate).isPresent());
        return candidate;
    }

    public CaseResponse createCase(CaseRequest req) {
        if (req.getCaseType() == null || req.getCaseType().isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "case_type is required.");
        }
        if (req.getFullName() == null || req.getFullName().isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "full_name is required.");
        }

        Case entity = Case.builder()
                .reportNumber(generateReportNumber())
                .caseType(req.getCaseType())
                .fullName(req.getFullName())
                .age(req.getAge())
                .gender(req.getGender())
                .dob(req.getDob())
                .bloodGroup(req.getBloodGroup())
                .photo(req.getPhoto())
                .status(req.getStatus() != null ? req.getStatus() : defaultStatusFor(req.getCaseType()))
                .height(req.getHeight())
                .weight(req.getWeight())
                .eyeColor(req.getEyeColor())
                .hairColor(req.getHairColor())
                .complexion(req.getComplexion())
                .build(req.getBuild())
                .identifyingMarks(req.getIdentifyingMarks())
                .medical(req.getMedical())
                .lastSeenLocation(req.getLastSeenLocation())
                .lastSeenDate(req.getLastSeenDate())
                .lastSeenTime(req.getLastSeenTime())
                .lastSeenWearing(req.getLastSeenWearing())
                .places(req.getPlaces())
                .description(req.getDescription())
                .incidentDate(req.getIncidentDate())
                .incidentTime(req.getIncidentTime())
                .incidentLocation(req.getIncidentLocation())
                .incidentDescription(req.getIncidentDescription())
                .itemDescription(req.getItemDescription())
                .itemSerial(req.getItemSerial())
                .itemValue(req.getItemValue())
                .vehicleNumber(req.getVehicleNumber())
                .vehicleType(req.getVehicleType())
                .vehicleModel(req.getVehicleModel())
                .suspectDescription(req.getSuspectDescription())
                .reporterName(req.getReporterName())
                .reporterPhone(req.getReporterPhone())
                .reporterPhone2(req.getReporterPhone2())
                .reporterRelation(req.getReporterRelation())
                .reporterEmail(req.getReporterEmail())
                .reporterAddress(req.getReporterAddress())
                .policeStation(req.getPoliceStation())
                .policeEmail(req.getPoliceEmail())
                .policePhone(req.getPolicePhone())
                .build();

        entity = caseRepository.save(entity);
        return CaseResponse.from(entity);
    }

    private String defaultStatusFor(String caseType) {
        return "missing_person".equals(caseType) ? "missing" : "investigating";
    }

    public List<CaseResponse> search(String status, String caseType, String q) {
        List<Case> results = caseRepository.findAll(buildSpec(status, caseType, q), Sort.by(Sort.Direction.DESC, "createdAt"));
        return results.stream().map(CaseResponse::from).toList();
    }

    /**
     * Paginated variant of search(). Caps page size to prevent a caller from
     * requesting the entire table in one shot.
     */
    public PagedResponse<CaseResponse> searchPaged(String status, String caseType, String q, int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 100);
        Pageable pageable = PageRequest.of(safePage, safeSize, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Case> result = caseRepository.findAll(buildSpec(status, caseType, q), pageable);
        Page<CaseResponse> mapped = result.map(CaseResponse::from);
        return PagedResponse.from(mapped);
    }

    private Specification<Case> buildSpec(String status, String caseType, String q) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (status != null && !status.isBlank()) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (caseType != null && !caseType.isBlank()) {
                predicates.add(cb.equal(root.get("caseType"), caseType));
            }
            if (q != null && !q.isBlank()) {
                String like = "%" + q.toLowerCase() + "%";
                Predicate byName = cb.like(cb.lower(root.get("fullName")), like);
                Predicate byLocation = cb.like(cb.lower(root.get("lastSeenLocation")), like);
                Predicate byReportNo = cb.like(cb.lower(root.get("reportNumber")), like);
                predicates.add(cb.or(byName, byLocation, byReportNo));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    public CaseResponse getById(Long id) {
        Case entity = caseRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Case not found."));
        return CaseResponse.from(entity);
    }

    public CaseResponse updateStatus(Long id, String status) {
        Case entity = caseRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Case not found."));
        entity.setStatus(status);
        entity = caseRepository.save(entity);
        return CaseResponse.from(entity);
    }

    public void delete(Long id) {
        if (!caseRepository.existsById(id)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Case not found.");
        }
        caseRepository.deleteById(id);
    }

    public CaseStatsResponse stats() {
        long total = caseRepository.count();
        long missing = caseRepository.countByStatus("missing");
        long found = caseRepository.countByStatus("found");
        long investigating = caseRepository.countByStatus("investigating");

        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        LocalDateTime endOfToday = LocalDate.now().atTime(LocalTime.MAX);
        Specification<Case> todaySpec = (root, query, cb) ->
                cb.between(root.get("createdAt"), startOfToday, endOfToday);
        long today = caseRepository.count(todaySpec);

        return CaseStatsResponse.builder()
                .total(total)
                .missing(missing)
                .found(found)
                .investigating(investigating)
                .today(today)
                .districts(Collections.emptyList())
                .ageGroups(Collections.emptyList())
                .monthly(Collections.emptyList())
                .build();
    }
}
