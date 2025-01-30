package com.gestionConges.backend.gestionConges.repository;

import com.gestionConges.backend.gestionConges.model.Admin;
import com.gestionConges.backend.gestionConges.model.AdminRH;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepo extends JpaRepository<Admin,Integer> {
    Admin findByEmail(String email);

}
