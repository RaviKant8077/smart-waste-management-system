package com.example.smart.waste.management.controller;

import com.example.smart.waste.management.dto.ComplaintStatusUpdateRequest;
import com.example.smart.waste.management.model.Complaint;
import com.example.smart.waste.management.model.ComplaintStatus;
import com.example.smart.waste.management.model.Route;
import com.example.smart.waste.management.model.User;
import com.example.smart.waste.management.repository.ComplaintRepository;
import com.example.smart.waste.management.repository.RouteRepository;
import com.example.smart.waste.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/supervisor")
@PreAuthorize("hasRole('SUPERVISOR')")
@RequiredArgsConstructor
public class SupervisorController {

    private final RouteRepository routeRepository;
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    @GetMapping("/routes/active")
    public ResponseEntity<List<Route>> getActiveRoutes() {
        List<Route> activeRoutes = routeRepository.findAll().stream()
                .filter(route -> route.getStatus() != null && route.getStatus().name().equals("ACTIVE"))
                .collect(Collectors.toList());
        return ResponseEntity.ok(activeRoutes);
    }

    @GetMapping("/complaints")
    public ResponseEntity<List<Map<String, Object>>> getAllComplaints(@RequestParam(required = false) String status) {
        List<Complaint> complaints;
        if (status != null && !status.equals("ALL")) {
            complaints = complaintRepository.findAll().stream()
                    .filter(complaint -> complaint.getStatus() != null && complaint.getStatus().name().equals(status))
                    .collect(Collectors.toList());
        } else {
            complaints = complaintRepository.findAll();
        }

        List<Map<String, Object>> complaintData = complaints.stream()
                .map(complaint -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("id", complaint.getId());
                    data.put("title", complaint.getTitle());
                    data.put("description", complaint.getDescription());
                    data.put("status", complaint.getStatus().name());
                    data.put("priority", complaint.getPriority() != null ? complaint.getPriority().name() : "MEDIUM");
                    data.put("location", complaint.getLocation());
                    data.put("latitude", complaint.getLatitude());
                    data.put("longitude", complaint.getLongitude());
                    data.put("createdAt", complaint.getCreatedAt());
                    data.put("citizenName", complaint.getCitizen().getUsername());
                    data.put("assignedEmployee", complaint.getAssignedEmployee() != null ? complaint.getAssignedEmployee().getUsername() : null);
                    data.put("images", complaint.getImages());
                    return data;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(complaintData);
    }

    @PutMapping("/complaints/{complaintId}/status")
    public ResponseEntity<Complaint> updateComplaintStatus(
            @PathVariable Long complaintId,
            @RequestBody ComplaintStatusUpdateRequest request,
            @AuthenticationPrincipal User supervisor
    ) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus(request.getStatus());
        complaint.setUpdatedAt(java.time.LocalDateTime.now());

        return ResponseEntity.ok(complaintRepository.save(complaint));
    }

    @PutMapping("/complaints/{complaintId}/assign")
    public ResponseEntity<Complaint> assignEmployeeToComplaint(
            @PathVariable Long complaintId,
            @RequestBody Map<String, Long> request,
            @AuthenticationPrincipal User supervisor
    ) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        User employee = userRepository.findById(request.get("employeeId"))
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        complaint.setAssignedEmployee(employee);
        complaint.setUpdatedAt(java.time.LocalDateTime.now());

        return ResponseEntity.ok(complaintRepository.save(complaint));
    }
}
