package com.gestionConges.backend.gestionConges.repository;

import com.gestionConges.backend.gestionConges.model.Personnel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PersonnelRepo extends JpaRepository<Personnel,Integer> {
    Optional<Personnel> findByEmail(String email);
}
