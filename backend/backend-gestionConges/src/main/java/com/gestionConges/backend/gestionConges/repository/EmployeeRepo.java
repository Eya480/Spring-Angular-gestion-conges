package com.gestionConges.backend.gestionConges.repository;

import com.gestionConges.backend.gestionConges.model.DemandeConge;
import com.gestionConges.backend.gestionConges.model.Departement;
import com.gestionConges.backend.gestionConges.model.Employe;
import com.gestionConges.backend.gestionConges.model.Manager;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepo extends JpaRepository<Employe,Integer> {
    Employe findByEmail(String email);

    List<Employe> findByDepartement(Departement departement);
}
