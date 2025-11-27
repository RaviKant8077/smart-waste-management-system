package com.example.smart.waste.management.model;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "employee_performance")
public class EmployeePerformance {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private User employee;

    private Integer totalPoints;
    
    private Integer monthlyPoints;
    
    private Integer streakDays;
    
    private Integer routesCompleted;
    
    private Integer complaintsResolved;
    
    @Column(nullable = false)
    private LocalDateTime lastUpdated;
    
    private String currentBadge;
    
    @Enumerated(EnumType.STRING)
    private PerformanceLevel performanceLevel;

    // Additional fields for dashboard display
    private Integer score;
    private Integer month;
    private Integer year;
}
