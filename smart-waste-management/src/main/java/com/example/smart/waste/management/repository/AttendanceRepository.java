package com.example.smart.waste.management.repository;

import com.example.smart.waste.management.model.Attendance;
import com.example.smart.waste.management.model.AttendanceStatus;
import com.example.smart.waste.management.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    Optional<Attendance> findByEmployeeAndDate(User employee, LocalDate date);

    List<Attendance> findByEmployee(User employee);

    List<Attendance> findByDate(LocalDate date);

    List<Attendance> findByEmployeeAndDateBetween(User employee, LocalDate startDate, LocalDate endDate);

    @Query("SELECT a FROM Attendance a WHERE a.employee = :employee AND MONTH(a.date) = :month AND YEAR(a.date) = :year")
    List<Attendance> findByEmployeeAndMonthAndYear(@Param("employee") User employee, @Param("month") int month, @Param("year") int year);

    long countByEmployeeAndStatusAndDateBetween(User employee, AttendanceStatus status, LocalDate startDate, LocalDate endDate);
}
