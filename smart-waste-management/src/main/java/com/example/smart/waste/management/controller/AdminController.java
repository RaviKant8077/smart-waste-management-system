package com.example.smart.waste.management.controller;

import com.example.smart.waste.management.model.*;
import com.example.smart.waste.management.repository.*;
import com.example.smart.waste.management.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN') or hasRole('SUPERVISOR')")
@RequiredArgsConstructor
public class AdminController {

    private final AttendanceService attendanceService;
    private final UserRepository userRepository;
    private final RouteRepository routeRepository;
    private final VehicleRepository vehicleRepository;
    private final ComplaintRepository complaintRepository;
    private final CollectionRecordRepository collectionRecordRepository;
    private final EmployeePerformanceRepository employeePerformanceRepository;

    @PostMapping("/attendance/process-daily")
    public ResponseEntity<String> processDailyAttendance() {
        attendanceService.processDailyAttendance();
        return ResponseEntity.ok("Daily attendance processed successfully");
    }

    @GetMapping("/attendance/{date}")
    public ResponseEntity<List<Attendance>> getAttendanceForDate(@PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        List<Attendance> attendances = attendanceService.getAllAttendanceForDate(localDate);
        return ResponseEntity.ok(attendances);
    }

    @GetMapping("/attendance/employee/{employeeId}")
    public ResponseEntity<List<Attendance>> getEmployeeAttendance(@PathVariable Long employeeId) {
        // This would need UserRepository to find the user, but for now returning empty list
        // In real implementation, inject UserRepository and find user by ID
        return ResponseEntity.ok(java.util.Collections.emptyList());
    }

    @PostMapping("/attendance/update/{attendanceId}")
    public ResponseEntity<Attendance> updateAttendanceStatus(
            @PathVariable Long attendanceId,
            @RequestParam AttendanceStatus status,
            @RequestParam(required = false) String remarks
    ) {
        // This would need AttendanceRepository to find and update attendance
        // For now, return null - implement when needed
        return ResponseEntity.ok(null);
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(@AuthenticationPrincipal User user) {
        Map<String, Object> stats = new HashMap<>();

        // Basic stats
        stats.put("totalUsers", userRepository.count());
        stats.put("totalRoutes", routeRepository.count());
        stats.put("totalVehicles", vehicleRepository.count());
        stats.put("activeComplaints", complaintRepository.findByStatus(ComplaintStatus.PENDING).size());
        stats.put("completedCollections", collectionRecordRepository.count());
        stats.put("pendingCollections", 0); // Mock value, can be calculated based on business logic

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/routes")
    public ResponseEntity<List<Route>> getRoutes() {
        List<Route> routes = routeRepository.findAll();
        return ResponseEntity.ok(routes);
    }

    @PostMapping("/routes")
    public ResponseEntity<Route> createRoute(@RequestBody Route route) {
        Route savedRoute = routeRepository.save(route);
        return ResponseEntity.ok(savedRoute);
    }

    @DeleteMapping("/routes/{id}")
    public ResponseEntity<Void> deleteRoute(@PathVariable Long id) {
        routeRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/vehicles")
    public ResponseEntity<List<Vehicle>> getVehicles() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        return ResponseEntity.ok(vehicles);
    }

    @PostMapping("/vehicles")
    public ResponseEntity<Vehicle> createVehicle(@RequestBody Vehicle vehicle) {
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return ResponseEntity.ok(savedVehicle);
    }

    @DeleteMapping("/vehicles/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        vehicleRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/reports")
    public ResponseEntity<Map<String, Object>> getReports() {
        Map<String, Object> reports = new HashMap<>();

        // Mock data for reports - in real implementation, calculate from actual data
        reports.put("totalWasteCollected", collectionRecordRepository.count());
        reports.put("totalComplaints", complaintRepository.count());
        reports.put("resolvedComplaints", complaintRepository.findByStatus(ComplaintStatus.RESOLVED).size());

        // Mock chart data
        List<Map<String, Object>> collectionData = java.util.Arrays.asList(
            new HashMap<String, Object>() {{ put("date", "2024-01-01"); put("count", 10); }},
            new HashMap<String, Object>() {{ put("date", "2024-01-02"); put("count", 15); }},
            new HashMap<String, Object>() {{ put("date", "2024-01-03"); put("count", 12); }}
        );
        reports.put("collectionData", collectionData);

        List<Map<String, Object>> complaintData = java.util.Arrays.asList(
            new HashMap<String, Object>() {{ put("status", "PENDING"); put("count", complaintRepository.findByStatus(ComplaintStatus.PENDING).size()); }},
            new HashMap<String, Object>() {{ put("status", "IN_PROGRESS"); put("count", complaintRepository.findByStatus(ComplaintStatus.IN_PROGRESS).size()); }},
            new HashMap<String, Object>() {{ put("status", "RESOLVED"); put("count", complaintRepository.findByStatus(ComplaintStatus.RESOLVED).size()); }}
        );
        reports.put("complaintData", complaintData);

        List<Map<String, Object>> performanceData = employeePerformanceRepository.findAll().stream()
            .map(perf -> {
                Map<String, Object> map = new HashMap<>();
                map.put("employee", perf.getEmployee() != null ? perf.getEmployee().getUsername() : "Unknown");
                map.put("score", perf.getScore());
                return map;
            })
            .collect(Collectors.toList());
        reports.put("performanceData", performanceData);

        return ResponseEntity.ok(reports);
    }
}
