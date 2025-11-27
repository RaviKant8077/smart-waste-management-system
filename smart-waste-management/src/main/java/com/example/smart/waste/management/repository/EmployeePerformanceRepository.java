package com.example.smart.waste.management.repository;

import com.example.smart.waste.management.model.EmployeePerformance;
import com.example.smart.waste.management.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeePerformanceRepository extends JpaRepository<EmployeePerformance, Long> {
    Optional<EmployeePerformance> findByEmployee(User employee);
}