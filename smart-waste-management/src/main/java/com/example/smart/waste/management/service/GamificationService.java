package com.example.smart.waste.management.service;

import com.example.smart.waste.management.model.*;
import com.example.smart.waste.management.repository.EmployeePerformanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GamificationService {

    private final EmployeePerformanceRepository performanceRepository;
    private final NotificationService notificationService;

    private static final int POINTS_PER_COLLECTION = 10;
    private static final int POINTS_PER_COMPLAINT_RESOLVED = 20;
    private static final int POINTS_FOR_ROUTE_COMPLETION = 50;
    private static final int STREAK_BONUS_MULTIPLIER = 2;

    @Transactional
    public void awardPointsForCollection(User employee, CollectionRecord record) {
        EmployeePerformance performance = getOrCreatePerformance(employee);

        int points = calculateCollectionPoints(record);
        performance.setTotalPoints(performance.getTotalPoints() + points);
        performance.setMonthlyPoints(performance.getMonthlyPoints() + points);
        
        updatePerformanceLevel(performance);
        performanceRepository.save(performance);
        notificationService.sendPerformanceAchievement(performance);
    }

    @Transactional
    public void awardPointsForComplaintResolution(User employee) {
        EmployeePerformance performance = getOrCreatePerformance(employee);
        
        performance.setTotalPoints(performance.getTotalPoints() + POINTS_PER_COMPLAINT_RESOLVED);
        performance.setMonthlyPoints(performance.getMonthlyPoints() + POINTS_PER_COMPLAINT_RESOLVED);
        performance.setComplaintsResolved(performance.getComplaintsResolved() + 1);
        
        updatePerformanceLevel(performance);
        performanceRepository.save(performance);
        notificationService.sendPerformanceAchievement(performance);
    }

    @Transactional
    public void awardPointsForRouteCompletion(User employee, Route route) {
        EmployeePerformance performance = getOrCreatePerformance(employee);
        
        int points = POINTS_FOR_ROUTE_COMPLETION;
        if (performance.getStreakDays() > 0) {
            points *= STREAK_BONUS_MULTIPLIER;
        }
        
        performance.setTotalPoints(performance.getTotalPoints() + points);
        performance.setMonthlyPoints(performance.getMonthlyPoints() + points);
        performance.setRoutesCompleted(performance.getRoutesCompleted() + 1);
        
        updatePerformanceLevel(performance);
        performanceRepository.save(performance);
        notificationService.sendPerformanceAchievement(performance);
    }

    private EmployeePerformance getOrCreatePerformance(User employee) {
        return performanceRepository.findByEmployee(employee)
                .orElseGet(() -> {
                    EmployeePerformance newPerformance = new EmployeePerformance();
                    newPerformance.setEmployee(employee);
                    newPerformance.setTotalPoints(0);
                    newPerformance.setMonthlyPoints(0);
                    newPerformance.setStreakDays(0);
                    newPerformance.setRoutesCompleted(0);
                    newPerformance.setComplaintsResolved(0);
                    newPerformance.setPerformanceLevel(PerformanceLevel.BRONZE);
                    return newPerformance;
                });
    }

    private int calculateCollectionPoints(CollectionRecord record) {
        int points = POINTS_PER_COLLECTION;
        
        // Bonus points for efficiency
        if (record.getStatus() == CollectionStatus1.COLLECTED) {
            points += 5;
        }
        
        return points;
    }

    private void updatePerformanceLevel(EmployeePerformance performance) {
        int totalPoints = performance.getTotalPoints();
        
        if (totalPoints >= 10000) {
            performance.setPerformanceLevel(PerformanceLevel.DIAMOND);
            performance.setCurrentBadge("Waste Management Expert");
        } else if (totalPoints >= 5000) {
            performance.setPerformanceLevel(PerformanceLevel.PLATINUM);
            performance.setCurrentBadge("Senior Collector");
        } else if (totalPoints >= 2500) {
            performance.setPerformanceLevel(PerformanceLevel.GOLD);
            performance.setCurrentBadge("Experienced Collector");
        } else if (totalPoints >= 1000) {
            performance.setPerformanceLevel(PerformanceLevel.SILVER);
            performance.setCurrentBadge("Regular Collector");
        } else {
            performance.setPerformanceLevel(PerformanceLevel.BRONZE);
            performance.setCurrentBadge("Novice Collector");
        }
    }
}