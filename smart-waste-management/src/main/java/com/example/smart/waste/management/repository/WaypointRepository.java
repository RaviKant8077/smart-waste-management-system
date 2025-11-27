package com.example.smart.waste.management.repository;

import com.example.smart.waste.management.model.Waypoint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WaypointRepository extends JpaRepository<Waypoint, Long> {
    List<Waypoint> findByRouteIdOrderBySequenceAsc(Long routeId);
}