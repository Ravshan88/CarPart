package com.example.backend.repository;

import com.example.backend.entity.CarPart;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CarPartRepository extends JpaRepository<CarPart, UUID> {
    List<CarPart> findByNameContainingIgnoreCase(String name);
}