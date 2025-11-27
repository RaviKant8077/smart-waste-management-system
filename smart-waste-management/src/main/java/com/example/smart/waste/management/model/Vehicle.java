package com.example.smart.waste.management.model;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "vehicles")
public class Vehicle {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String registrationNo;

    @Column(nullable = false)
    private String type;

    private Double capacityKg;

    private String ward;

    @Enumerated(EnumType.STRING)
    private VehicleStatus status;
}