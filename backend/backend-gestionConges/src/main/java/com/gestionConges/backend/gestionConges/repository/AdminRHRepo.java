package com.gestionConges.backend.gestionConges.repository;

import com.gestionConges.backend.gestionConges.model.AdminRH;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRHRepo extends JpaRepository<AdminRH,Integer> {
    AdminRH findFirstByOrderByIdAsc();

}
