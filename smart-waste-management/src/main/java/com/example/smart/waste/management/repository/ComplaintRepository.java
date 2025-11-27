package com.example.smart.waste.management.repository;

import com.example.smart.waste.management.model.Complaint;
import com.example.smart.waste.management.model.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByCitizenId(Long citizenId);
    List<Complaint> findByStatus(ComplaintStatus status);
}
