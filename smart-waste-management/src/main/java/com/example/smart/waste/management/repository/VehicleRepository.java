package com.example.smart.waste.management.repository;

import com.example.smart.waste.management.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
}