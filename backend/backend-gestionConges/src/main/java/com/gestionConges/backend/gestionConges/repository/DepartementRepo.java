package com.gestionConges.backend.gestionConges.repository;

import com.gestionConges.backend.gestionConges.model.Departement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartementRepo extends JpaRepository<Departement,Integer> {
    public Departement findByNomDep(String nomDep);
}
