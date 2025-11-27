package com.example.smart.waste.management.repository;

import com.example.smart.waste.management.model.BinStatus;
import com.example.smart.waste.management.model.SmartBin;
import com.example.smart.waste.management.model.WasteType;
import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;
import java.util.List;

public interface SmartBinRepository extends JpaRepository<SmartBin, Long> {
    List<SmartBin> findByCurrentFillLevelGreaterThan(Double threshold);
    List<SmartBin> findByStatusAndCurrentFillLevelGreaterThan(BinStatus status, Double threshold);
    List<SmartBin> findByWasteType(WasteType wasteType);
}