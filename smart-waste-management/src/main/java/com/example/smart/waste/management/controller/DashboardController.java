package com.example.smart.waste.management.controller;

import com.example.smart.waste.management.model.User;
import com.example.smart.waste.management.model.UserRole;
import com.example.smart.waste.management.model.RouteStatus;
import com.example.smart.waste.management.model.ComplaintStatus;
import com.example.smart.waste.management.model.Waypoint;
import com.example.smart.waste.management.repository.*;
import com.example.smart.waste.management.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final CollectionRecordRepository collectionRecordRepository;
    private final ComplaintRepository complaintRepository;
    private final RouteRepository routeRepository;
    private final EmployeePerformanceRepository employeePerformanceRepository;
    private final UserRepository userRepository;
//     private final VehicleRepository vehicleRepository;
    private final WaypointRepository waypointRepository;
    private final AttendanceService attendanceService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(@AuthenticationPrincipal User user) {
        Map<String, Object> response = new HashMap<>();

        // Basic stats based on user role
        Map<String, Object> stats = new HashMap<>();

        switch (user.getRole()) {
            case ADMIN:
            case SUPERVISOR:
                // Full stats for admin/supervisor
                stats.put("totalCollections", collectionRecordRepository.count());
                stats.put("activeRoutes", routeRepository.findByStatus(RouteStatus.IN_PROGRESS).size());
                stats.put("pendingComplaints", complaintRepository.findByStatus(ComplaintStatus.PENDING).size());
                stats.put("totalEmployees", userRepository.findAll().stream()
                        .filter(u -> u.getRole() != null && u.getRole().name().equals("EMPLOYEE"))
                        .count());
                break;

            case EMPLOYEE:
                // Employee-specific stats
                stats.put("assignedRoutes", routeRepository.findAll().stream()
                        .filter(route -> route.getEmployee() != null && route.getEmployee().getId().equals(user.getId()))
                        .count());
                stats.put("completedCollections", collectionRecordRepository.findAll().stream()
                        .filter(record -> record.getEmployee() != null && record.getEmployee().getId().equals(user.getId()))
                        .count());
                stats.put("pendingComplaints", complaintRepository.findByStatus(ComplaintStatus.PENDING).size());

                // Add attendance stats for current month
                LocalDate now = LocalDate.now();
                Map<String, Object> attendanceStats = attendanceService.getEmployeeAttendanceStats(
                        user, now.withDayOfMonth(1), now);
                response.put("attendance", attendanceStats);
                break;

            case CITIZEN:
            default:
                // Citizen stats - focus on their complaints and nearby services
                stats.put("myComplaints", complaintRepository.findAll().stream()
                        .filter(complaint -> (complaint).getUser() != null && complaint.getUser().getId().equals(user.getId()))
                        .count());
                stats.put("resolvedComplaints", complaintRepository.findAll().stream()
                        .filter(complaint -> complaint.getUser() != null && complaint.getUser().getId().equals(user.getId())
                                && complaint.getStatus() != null && complaint.getStatus().name().equals("RESOLVED"))
                        .count());
                stats.put("pendingComplaints", complaintRepository.findAll().stream()
                        .filter(complaint -> complaint.getUser() != null && complaint.getUser().getId().equals(user.getId())
                                && complaint.getStatus() != null && complaint.getStatus().name().equals("PENDING"))
                        .count());
                stats.put("activeRoutes", routeRepository.findAll().stream()
                        .filter(route -> route.getStatus() != null && route.getStatus().name().equals("IN_PROGRESS"))
                        .count());
                break;
        }

        // Calculate average employee performance (visible to all roles)
        double avgPerformance = employeePerformanceRepository.findAll().stream()
                .mapToDouble(perf -> {
                    if (perf.getPerformanceLevel() == null) return 0.0;
                    switch (perf.getPerformanceLevel()) {
                        case BRONZE: return 20.0;
                        case SILVER: return 40.0;
                        case GOLD: return 60.0;
                        case PLATINUM: return 80.0;
                        case DIAMOND: return 100.0;
                        default: return 0.0;
                    }
                })
                .average()
                .orElse(0.0);
        stats.put("employeePerformance", Math.round(avgPerformance));

        // Mock trend data (in real implementation, calculate from historical data)
        stats.put("collectionsChange", 5);
        stats.put("complaintsChange", -10);
        stats.put("performanceChange", 2);

        response.put("stats", stats);

        // Routes data with collection status
        List<Map<String, Object>> routesData = routeRepository.findAll().stream()
                .map(route -> {
                    Map<String, Object> routeInfo = new HashMap<>();
                    routeInfo.put("id", route.getId());
                    routeInfo.put("name", route.getName());
                    routeInfo.put("status", route.getStatus() != null ? route.getStatus().name() : "UNKNOWN");
                    routeInfo.put("assignedEmployee", route.getEmployee() != null ? route.getEmployee().getUsername() : null);

                    // Check if route has been collected today
                    boolean collectedToday = collectionRecordRepository.findAll().stream()
                            .anyMatch(record -> record.getRoute() != null && record.getRoute().getId().equals(route.getId())
                                    && record.getCollectionDate() != null && record.getCollectionDate().isEqual(LocalDate.now()));
                    routeInfo.put("collectedToday", collectedToday);

                    return routeInfo;
                })
                .collect(Collectors.toList());

        response.put("routes", routesData);

        // Complaints data (filtered by role)
        List<Map<String, Object>> complaintsData;
        if (user.getRole() == UserRole.ADMIN || user.getRole() == UserRole.SUPERVISOR) {
            complaintsData = complaintRepository.findAll().stream()
                    .map(complaint -> {
                        Map<String, Object> complaintInfo = new HashMap<>();
                        complaintInfo.put("id", complaint.getId());
                        complaintInfo.put("description", complaint.getDescription());
                        complaintInfo.put("status", complaint.getStatus() != null ? complaint.getStatus().name() : "UNKNOWN");
                        complaintInfo.put("createdDate", complaint.getCreatedAt());
                        complaintInfo.put("user", complaint.getUser() != null ? complaint.getUser().getUsername() : null);
                        return complaintInfo;
                    })
                    .collect(Collectors.toList());
        } else {
            // For employees and citizens, show only their complaints
            complaintsData = complaintRepository.findAll().stream()
                    .filter(complaint -> complaint.getUser() != null && complaint.getUser().getId().equals(user.getId()))
                    .map(complaint -> {
                        Map<String, Object> complaintInfo = new HashMap<>();
                        complaintInfo.put("id", complaint.getId());
                        complaintInfo.put("description", complaint.getDescription());
                        complaintInfo.put("status", complaint.getStatus() != null ? complaint.getStatus().name() : "UNKNOWN");
                        complaintInfo.put("createdDate", complaint.getCreatedAt());
                        return complaintInfo;
                    })
                    .collect(Collectors.toList());
        }

        response.put("complaints", complaintsData);

        // Employee performance data (visible to all roles)
        List<Map<String, Object>> performanceData = employeePerformanceRepository.findAll().stream()
                .map(perf -> {
                    Map<String, Object> perfInfo = new HashMap<>();
                    perfInfo.put("employeeName", perf.getEmployee() != null ? perf.getEmployee().getUsername() : null);
                    perfInfo.put("performanceLevel", perf.getPerformanceLevel() != null ? perf.getPerformanceLevel().name() : "UNKNOWN");
                    perfInfo.put("score", perf.getScore());
                    perfInfo.put("month", perf.getMonth());
                    perfInfo.put("year", perf.getYear());
                    return perfInfo;
                })
                .collect(Collectors.toList());

        response.put("employeePerformance", performanceData);

        // Chart data - last 7 days waste collection (visible to all roles)
        Map<String, Object> chartData = new HashMap<>();
        LocalDate today = LocalDate.now();
        String[] labels = new String[7];
        double[] values = new double[7];

        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            labels[6 - i] = date.toString();
            // Mock data - in real implementation, query actual collection records
            values[6 - i] = Math.random() * 50 + 20; // Random values between 20-70
        }

        chartData.put("labels", labels);
        chartData.put("values", values);
        response.put("chartData", chartData);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/routes/{routeId}/waypoints")
    public ResponseEntity<List<Waypoint>> getRouteWaypoints(@PathVariable Long routeId) {
        List<Waypoint> waypoints = waypointRepository.findByRouteIdOrderBySequenceAsc(routeId);
        return ResponseEntity.ok(waypoints);
    }
}
