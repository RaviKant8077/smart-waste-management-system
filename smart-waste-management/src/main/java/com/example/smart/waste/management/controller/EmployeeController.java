package com.example.smart.waste.management.controller;

import com.example.smart.waste.management.dto.CollectionUpdateRequest;
import com.example.smart.waste.management.dto.RouteCompletionRequest;
import com.example.smart.waste.management.model.*;
import com.example.smart.waste.management.service.AttendanceService;
import com.example.smart.waste.management.service.RouteService;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/employee")
@PreAuthorize("hasRole('EMPLOYEE')")
@RequiredArgsConstructor
public class EmployeeController {

    private final RouteService routeService;
    private final AttendanceService attendanceService;

    @GetMapping("/routes/today")
    public ResponseEntity<List<Route>> getTodayRoutes(@AuthenticationPrincipal User employee) {
        return ResponseEntity.ok(routeService.getEmployeeRoutesForDay(employee.getId(), LocalDate.now()));
    }

    @GetMapping("/routes/{date}")
    public ResponseEntity<List<Route>> getRoutesByDate(
            @RequestParam Long employeeId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(routeService.getEmployeeRoutesForDay(employeeId, date));
    }

    @GetMapping("/route/{routeId}/waypoints")
    public ResponseEntity<List<Waypoint>> getRouteWaypoints(@PathVariable Long routeId) {
        return ResponseEntity.ok(routeService.getRouteWaypoints(routeId));
    }

    @PostMapping("/collection/update")
    public ResponseEntity<CollectionRecord> updateCollection(@Valid @RequestBody CollectionUpdateRequest request) {
        return ResponseEntity.ok(routeService.updateCollectionStatus(
                request.getRouteId(),
                request.getWaypointId(),
                request.getStatus(),
                request.getPhotoUrl(),
                request.getLatitude(),
                request.getLongitude()
        ));
    }

    @PostMapping("/route/complete")
    public ResponseEntity<String> completeRoute(@Valid @RequestBody RouteCompletionRequest request) {
        routeService.completeRoute(request.getRouteId(), request.getRemark(), request.getPhotoUrl());
        return ResponseEntity.ok("Route completed successfully");
    }

    @PostMapping("/attendance/mark")
    public ResponseEntity<Attendance> markAttendance(
            @AuthenticationPrincipal User employee,
            @RequestParam AttendanceStatus status,
            @RequestParam(required = false) String remarks
    ) {
        Attendance attendance = attendanceService.markAttendance(employee, LocalDate.now(), status, remarks);
        return ResponseEntity.ok(attendance);
    }

    @GetMapping("/attendance/today")
    public ResponseEntity<Map<String, Object>> getTodayAttendance(@AuthenticationPrincipal User employee) {
        Optional<Attendance> attendance = attendanceService.getAttendance(employee, LocalDate.now());
        Map<String, Object> response = new HashMap<>();

        if (attendance.isPresent()) {
            response.put("marked", true);
            response.put("status", attendance.get().getStatus());
            response.put("checkInTime", attendance.get().getCheckInTime());
            response.put("remarks", attendance.get().getRemarks());
        } else {
            response.put("marked", false);
            response.put("status", AttendanceStatus.PENDING);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/attendance/stats")
    public ResponseEntity<Map<String, Object>> getAttendanceStats(
            @AuthenticationPrincipal User employee,
            @RequestParam int month,
            @RequestParam int year
    ) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        Map<String, Object> stats = attendanceService.getEmployeeAttendanceStats(employee, startDate, endDate);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/collections/today")
    public ResponseEntity<List<CollectionRecord>> getTodayCollections(@AuthenticationPrincipal User employee) {
        return ResponseEntity.ok(routeService.getEmployeeCollectionsForDay(employee.getId(), LocalDate.now()));
    }
}
