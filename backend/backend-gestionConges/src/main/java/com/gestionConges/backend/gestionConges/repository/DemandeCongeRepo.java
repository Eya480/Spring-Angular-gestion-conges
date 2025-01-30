package com.gestionConges.backend.gestionConges.repository;

import com.gestionConges.backend.gestionConges.model.DemandeConge;
import com.gestionConges.backend.gestionConges.model.Employe;
import com.gestionConges.backend.gestionConges.model.TypeConge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DemandeCongeRepo extends JpaRepository<DemandeConge,Integer> {
    List<DemandeConge> findByEmploye(Employe employe);

    Optional<DemandeConge> findByTypeConge(TypeConge typeConge);

    DemandeConge findByDateDebut(LocalDate dateDebut);

    DemandeConge findByDateFin(LocalDate dateFin);

    DemandeConge findDemandeCongeByIdDemande(Integer IdDemande);

    @Query("SELECT d.employe FROM DemandeConge d WHERE d = :demandeConge")
    Employe findEmployeByDemandeConge(@Param("demandeConge") DemandeConge demandeConge);



}
