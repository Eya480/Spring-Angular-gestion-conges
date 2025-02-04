package com.gestionConges.backend.gestionConges.repository;

import com.gestionConges.backend.gestionConges.model.DemandeConge;
import com.gestionConges.backend.gestionConges.model.Employe;
import com.gestionConges.backend.gestionConges.model.Manager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface DemandeCongeRepo extends JpaRepository<DemandeConge,Integer> {
    List<DemandeConge> findByEmploye(Employe employe);

    List<DemandeConge> findByManager(Manager manager);
    DemandeConge findDemandeCongeByIdDemande(Integer IdDemande);

    @Query("SELECT d.employe FROM DemandeConge d WHERE d = :demandeConge")
    Employe findEmployeByDemandeConge(@Param("demandeConge") DemandeConge demandeConge);



}
