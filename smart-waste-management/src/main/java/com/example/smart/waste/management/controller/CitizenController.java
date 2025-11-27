package com.example.smart.waste.management.controller;

import com.example.smart.waste.management.dto.ComplaintRequest;
import com.example.smart.waste.management.model.Complaint;
import com.example.smart.waste.management.model.User;
import com.example.smart.waste.management.service.ComplaintService;
import com.example.smart.waste.management.service.RouteService;
import com.example.smart.waste.management.model.Route;
import com.example.smart.waste.management.model.Waypoint;
import com.example.smart.waste.management.model.SmartBin;
import com.example.smart.waste.management.repository.SmartBinRepository;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/citizen")
@PreAuthorize("hasRole('CITIZEN')")
@RequiredArgsConstructor
public class CitizenController {

    private final ComplaintService complaintService;
    private final RouteService routeService;
    private final SmartBinRepository smartBinRepository;

    @PostMapping("/complaint")
    public ResponseEntity<Complaint> createComplaint(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ComplaintRequest request
    ) {
        return ResponseEntity.ok(complaintService.createComplaint(
                user.getId(),
                request.getTitle(),
                request.getDescription(),
                request.getPhotoUrl(),
                request.getLatitude(),
                request.getLongitude(),
                request.getLocation(),
                request.getImages()
        ));
    }

    @GetMapping("/complaints")
    public ResponseEntity<List<Complaint>> getMyComplaints(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(complaintService.getCitizenComplaints(user.getId()));
    }

    @GetMapping("/schedule")
    public ResponseEntity<List<Object>> getSchedule(@RequestParam String date) {
        try {
            LocalDate selectedDate = LocalDate.parse(date);

            // Get all routes for the selected date
            List<Route> routes = routeService.getEmployeeRoutesForDay(null, selectedDate); // null for all employees

            // Transform routes into schedule items
            List<Object> scheduleItems = routes.stream().map(route -> {
                List<Waypoint> waypoints = routeService.getRouteWaypoints(route.getId());

                return waypoints.stream().map(waypoint -> {
                    SmartBin bin = smartBinRepository.findById(Long.parseLong(waypoint.getBinId() != null ? waypoint.getBinId() : "1")).orElse(null);

                    return new Object() {
                        public String area = bin != null ? "Area " + waypoint.getSequence() : "Area " + waypoint.getSequence();
                        public String address = String.format("Lat: %.6f, Lng: %.6f", waypoint.getLatitude(), waypoint.getLongitude());
                        public String wasteType = bin != null ? bin.getWasteType().toString() : "GENERAL";
                        public String scheduledTime = route.getScheduleDate().toLocalTime().toString();
                        public String vehicleLicensePlate = route.getVehicle() != null ? route.getVehicle().getRegistrationNo() : "N/A";
                        public String status = route.getStatus().toString();
                        public String notes = "Collection scheduled for " + selectedDate.toString();
                    };
                }).collect(Collectors.toList());
            }).flatMap(List::stream).collect(Collectors.toList());

            return ResponseEntity.ok(scheduleItems);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
