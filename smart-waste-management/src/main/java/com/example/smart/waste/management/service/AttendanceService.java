package com.example.smart.waste.management.service;

import com.example.smart.waste.management.model.Attendance;
import com.example.smart.waste.management.model.AttendanceStatus;
import com.example.smart.waste.management.model.User;
import com.example.smart.waste.management.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    @Transactional
    public Attendance markAttendance(User employee, LocalDate date, AttendanceStatus status, String remarks) {
        Optional<Attendance> existingAttendance = attendanceRepository.findByEmployeeAndDate(employee, date);

        Attendance attendance;
        if (existingAttendance.isPresent()) {
            attendance = existingAttendance.get();
            attendance.setStatus(status);
            attendance.setRemarks(remarks);
            attendance.setUpdatedAt(LocalDateTime.now());

            if (status == AttendanceStatus.PRESENT && attendance.getCheckInTime() == null) {
                attendance.setCheckInTime(LocalDateTime.now());
            }
        } else {
            attendance = new Attendance();
            attendance.setEmployee(employee);
            attendance.setDate(date);
            attendance.setStatus(status);
            attendance.setRemarks(remarks);
            attendance.setCreatedAt(LocalDateTime.now());
            attendance.setUpdatedAt(LocalDateTime.now());

            if (status == AttendanceStatus.PRESENT) {
                attendance.setCheckInTime(LocalDateTime.now());
            }
        }

        return attendanceRepository.save(attendance);
    }

    public Optional<Attendance> getAttendance(User employee, LocalDate date) {
        return attendanceRepository.findByEmployeeAndDate(employee, date);
    }

    public List<Attendance> getEmployeeAttendance(User employee) {
        return attendanceRepository.findByEmployee(employee);
    }

    public List<Attendance> getEmployeeAttendanceForMonth(User employee, int month, int year) {
        return attendanceRepository.findByEmployeeAndMonthAndYear(employee, month, year);
    }

    public Map<String, Object> getEmployeeAttendanceStats(User employee, LocalDate startDate, LocalDate endDate) {
        long presentDays = attendanceRepository.countByEmployeeAndStatusAndDateBetween(
                employee, AttendanceStatus.PRESENT, startDate, endDate);
        long totalDays = java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate) + 1;

        Map<String, Object> stats = new HashMap<>();
        stats.put("daysPresent", presentDays);
        stats.put("workingDays", totalDays);
        stats.put("attendancePercentage", totalDays > 0 ? (presentDays * 100.0) / totalDays : 0.0);

        return stats;
    }

    @Transactional
    public void processDailyAttendance() {
        LocalDate today = LocalDate.now();
        // This would need UserRepository to get all employees
        // For now, we'll process attendance for employees who have existing attendance records
        List<Attendance> allAttendances = attendanceRepository.findAll();
        List<User> employees = allAttendances.stream()
                        .map(Attendance::getEmployee)
                        .distinct()
                .collect(Collectors.toList());

        for (User employee : employees) {
            Optional<Attendance> todayAttendance = attendanceRepository.findByEmployeeAndDate(employee, today);
            if (!todayAttendance.isPresent()) {
                // Mark as absent if no attendance record exists for today
                markAttendance(employee, today, AttendanceStatus.ABSENT, "Auto-marked as absent");
            }
        }
    }

    public List<Attendance> getAllAttendanceForDate(LocalDate date) {
        return attendanceRepository.findByDate(date);
    }
}
