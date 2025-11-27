package com.example.smart.waste.management.repository;

import com.example.smart.waste.management.model.Page;
import com.example.smart.waste.management.model.PageAssignment;
import com.example.smart.waste.management.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PageAssignmentRepository extends JpaRepository<PageAssignment, Long> {
    Optional<PageAssignment> findByUserAndPage(User user, Page page);
}
