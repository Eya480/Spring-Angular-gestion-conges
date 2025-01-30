package com.gestionConges.backend.gestionConges.repository;

import com.gestionConges.backend.gestionConges.model.TypeConge;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TypeCongeRepo extends JpaRepository<TypeConge,Integer> {
    TypeConge findByNomTypeConge(String nomTypeConge);
}
