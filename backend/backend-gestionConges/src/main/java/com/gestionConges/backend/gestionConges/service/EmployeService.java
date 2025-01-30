package com.gestionConges.backend.gestionConges.service;

import com.gestionConges.backend.gestionConges.model.*;
import com.gestionConges.backend.gestionConges.repository.DemandeCongeRepo;
import com.gestionConges.backend.gestionConges.repository.EmployeeRepo;
import com.gestionConges.backend.gestionConges.repository.PersonnelRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeService {

    @Autowired
    private EmployeeRepo employeeRepo;

    @Autowired
    private PersonnelRepo personnelRepo;

    @Autowired
    private DemandeCongeRepo demandeCongeRepo;


    public Employe getEmployeById(Integer id) {
        Optional<Personnel> optionalPersonnel = personnelRepo.findById(id);
        if (optionalPersonnel.isPresent() && optionalPersonnel.get() instanceof Employe) {
            return (Employe) optionalPersonnel.get(); // On cast ici pour récupérer l'employé
        }
        return null;
    }

    public List<DemandeConge> getAllDemandeCongeByEmploye(String email){
        Employe employe=employeeRepo.findByEmail(email);
        return demandeCongeRepo.findByEmploye(employe);
    }

    //manager
    public List<Employe> getEmployeesByDepartement(Departement departement){
        return employeeRepo.findByDepartement(departement);
    }

}
