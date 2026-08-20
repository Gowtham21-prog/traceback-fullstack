package com.traceback.repository;

import com.traceback.entity.Case;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface CaseRepository extends JpaRepository<Case, Long>, JpaSpecificationExecutor<Case> {
    Optional<Case> findByReportNumber(String reportNumber);
    long countByStatus(String status);
}
