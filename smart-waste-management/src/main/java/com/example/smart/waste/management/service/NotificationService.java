package com.example.smart.waste.management.service;

import com.example.smart.waste.management.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendBinAlert(SmartBin bin) {
        Map<String, Object> alert = new HashMap<>();
        alert.put("type", "BIN_ALERT");
        alert.put("binId", bin.getBinId());
        Map<String, Double> location = new HashMap<>();
        location.put("lat", bin.getLatitude());
        location.put("lng", bin.getLongitude());
        alert.put("location", location);
        alert.put("status", bin.getStatus());
        alert.put("fillLevel", bin.getCurrentFillLevel());
        alert.put("timestamp", LocalDateTime.now());

        messagingTemplate.convertAndSend("/topic/alerts", alert);
    }

    public void sendRouteUpdate(Route route) {
        Map<String, Object> update = new HashMap<>();
        update.put("type", "ROUTE_UPDATE");
        update.put("routeId", route.getId());
        update.put("status", route.getStatus());
        update.put("employeeId", route.getEmployee().getId());
        update.put("timestamp", LocalDateTime.now());

        messagingTemplate.convertAndSend("/topic/routes", update);
    }

    public void sendComplaintUpdate(Complaint complaint) {
        Map<String, Object> update = new HashMap<>();
        update.put("type", "COMPLAINT_UPDATE");
        update.put("complaintId", complaint.getId());
        update.put("status", complaint.getStatus());
        update.put("timestamp", LocalDateTime.now());

        // Send to specific citizen
        messagingTemplate.convertAndSend(
            "/topic/complaints/" + complaint.getCitizen().getId(), 
            update
        );
    }

    public void sendPerformanceAchievement(EmployeePerformance performance) {
        Map<String, Object> achievement = new HashMap<>();
        achievement.put("type", "ACHIEVEMENT");
        achievement.put("employeeId", performance.getEmployee().getId());
        achievement.put("badge", performance.getCurrentBadge());
        achievement.put("level", performance.getPerformanceLevel());
        achievement.put("points", performance.getTotalPoints());
        achievement.put("timestamp", LocalDateTime.now());

        messagingTemplate.convertAndSend(
            "/topic/achievements/" + performance.getEmployee().getId(),
            achievement
        );
    }
}