package com.example.smart.waste.management.service;

import com.example.smart.waste.management.model.*;
import com.example.smart.waste.management.repository.CollectionRecordRepository;
import com.example.smart.waste.management.repository.RouteRepository;
import com.example.smart.waste.management.repository.WaypointRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RouteService {

    private final RouteRepository routeRepository;
    private final WaypointRepository waypointRepository;
    private final CollectionRecordRepository collectionRecordRepository;

    public List<Route> getEmployeeRoutesForDay(Long employeeId, LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        if (employeeId != null) {
            return routeRepository.findByEmployee_IdAndScheduleDateBetween(employeeId, startOfDay, endOfDay);
        } else {
            // For citizens, get all routes for the day
            return routeRepository.findAll().stream()
                    .filter(route -> route.getScheduleDate().toLocalDate().equals(date))
                    .collect(java.util.stream.Collectors.toList());
        }
    }

    @Transactional
    public CollectionRecord updateCollectionStatus(
            Long routeId,
            Long waypointId,
            CollectionStatus1 status,
            String photoUrl,
            Double latitude,
            Double longitude
    ) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));
        
        Waypoint waypoint = waypointRepository.findById(waypointId)
                .orElseThrow(() -> new RuntimeException("Waypoint not found"));

        CollectionRecord record = new CollectionRecord();
        record.setRoute(route);
        record.setWaypoint(waypoint);
        record.setStatus(status);
        record.setCollectedAt(LocalDateTime.now());
        record.setPhotoUrl(photoUrl);
        record.setLatitude(latitude);
        record.setLongitude(longitude);

        return collectionRecordRepository.save(record);
    }

    public List<Waypoint> getRouteWaypoints(Long routeId) {
        return waypointRepository.findByRouteIdOrderBySequenceAsc(routeId);
    }

    @Transactional
    public void completeRoute(Long routeId, String remark, String photoUrl) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));

        // Update route status to COMPLETED
        route.setStatus(RouteStatus.COMPLETED);
        routeRepository.save(route);

        // Get all waypoints for this route
        List<Waypoint> waypoints = waypointRepository.findByRouteIdOrderBySequenceAsc(routeId);

        // Create collection records for each waypoint
        for (Waypoint waypoint : waypoints) {
            CollectionRecord record = new CollectionRecord();
            record.setRoute(route);
            record.setWaypoint(waypoint);
            record.setEmployee(route.getEmployee());
            record.setStatus(CollectionStatus1.COLLECTED);
            record.setCollectedAt(java.time.LocalDateTime.now());
            record.setCollectionDate(java.time.LocalDate.now());
            record.setPhotoUrl(photoUrl);
            record.setLatitude(waypoint.getLatitude()); // Use waypoint coordinates
            record.setLongitude(waypoint.getLongitude());
            record.setRemark(remark); // Save the remark in the collection record
            collectionRecordRepository.save(record);
        }
    }

    public List<CollectionRecord> getEmployeeCollectionsForDay(Long employeeId, LocalDate date) {
        return collectionRecordRepository.findByEmployee_IdAndCollectionDate(employeeId, date);
    }
}