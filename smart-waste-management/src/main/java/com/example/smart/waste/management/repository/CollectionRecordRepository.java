package com.example.smart.waste.management.repository;

import com.example.smart.waste.management.model.CollectionRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface CollectionRecordRepository extends JpaRepository<CollectionRecord, Long> {
    List<CollectionRecord> findByEmployee_IdAndCollectionDate(Long employeeId, LocalDate collectionDate);
}
