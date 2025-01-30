package com.gestionConges.backend.gestionConges.repository;

import com.gestionConges.backend.gestionConges.model.Departement;
import com.gestionConges.backend.gestionConges.model.Manager;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ManagerRepo extends JpaRepository<Manager,Integer> {
    Manager findByEmail(String email);

    Manager findManagerByDepartement(Departement departement);
}
