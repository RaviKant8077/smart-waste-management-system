package com.example.smart.waste.management.repository;

import com.example.smart.waste.management.model.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PageRepository extends JpaRepository<Page, Long> {
    Optional<Page> findByPath(String path);
    Optional<Page> findByName(String name);
}
