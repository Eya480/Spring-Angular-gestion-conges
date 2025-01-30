package com.gestionConges.backend.gestionConges.repository;

import com.gestionConges.backend.gestionConges.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PersonnelRepo extends JpaRepository<Personnel,Integer> {

    // Vérifie si un utilisateur existe déjà avec l'email
    boolean existsByEmail(String email);

    Optional<Personnel> findByEmail(String email);
    // Trouver les employés sous la responsabilité d'un manager donné
    Optional<Employe> findByManager(Manager manager);
    // Méthodes pour récupérer les employés
    @Query("SELECT e FROM Employe e")
    List<Employe> findAllEmployees();

    // Méthodes pour récupérer les managers
    @Query("SELECT m FROM Manager m")
    List<Manager> findAllManagers();

    // Méthode pour récupérer l'unique Admin
    @Query("SELECT a FROM Admin a")
    Optional<Admin> findAdmin();

    // Méthode pour récupérer l'unique AdminRH
    @Query("SELECT ar FROM AdminRH ar")
    Optional<AdminRH> findAdminRH();
}
