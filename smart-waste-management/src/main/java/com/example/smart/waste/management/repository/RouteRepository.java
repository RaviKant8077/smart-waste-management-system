package com.example.smart.waste.management.repository;

import com.example.smart.waste.management.model.Route;
import com.example.smart.waste.management.model.RouteStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface RouteRepository extends JpaRepository<Route, Long> {
    List<Route> findByEmployee_IdAndScheduleDateBetween(Long employeeId, LocalDateTime start, LocalDateTime end);
    List<Route> findByStatus(RouteStatus status);

    List<Route> findByEmployeeIdAndScheduleDateBetween(Long employeeId, LocalDateTime startOfDay, LocalDateTime endOfDay);
}
