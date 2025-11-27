package com.example.smart.waste.management.model;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "smart_bins")
public class SmartBin {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String binId;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private Integer capacityLiters;

    private Double currentFillLevel; // Percentage

    private Double temperatureCelsius;

    private Boolean lidOpen;

    @Enumerated(EnumType.STRING)
    private WasteType wasteType;

    @Column(nullable = false)
    private LocalDateTime lastUpdated;

    @Enumerated(EnumType.STRING)
    private BinStatus status;

    private String maintenanceNotes;
}