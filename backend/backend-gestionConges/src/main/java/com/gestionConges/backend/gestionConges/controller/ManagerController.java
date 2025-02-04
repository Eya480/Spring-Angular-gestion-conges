package com.gestionConges.backend.gestionConges.controller;

import com.gestionConges.backend.gestionConges.model.DemandeConge;
import com.gestionConges.backend.gestionConges.model.Employe;
import com.gestionConges.backend.gestionConges.model.Manager;
import com.gestionConges.backend.gestionConges.repository.DemandeCongeRepo;
import com.gestionConges.backend.gestionConges.repository.ManagerRepo;
import com.gestionConges.backend.gestionConges.service.DemandeCongeService;
import com.gestionConges.backend.gestionConges.service.EmployeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/Manager")
public class ManagerController {

    @Autowired
    private EmployeService employeService;

    @Autowired
    private DemandeCongeService demandeCongeService;

    @Autowired
    private ManagerRepo managerRepo;

    @Autowired
    private DemandeCongeRepo demandeCongeRepo;

    @GetMapping("/get-all-demande-by-manager")
    public ResponseEntity<List<DemandeConge>> getAllDemandeByManager() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Manager manager = managerRepo.findByEmail(email);

        List<Employe> employes = employeService.getEmployeesByDepartement(manager.getDepartement());

        List<DemandeConge> demandeConges = new ArrayList<>();

        for (Employe employe : employes) {
            List<DemandeConge> employeeDemands = demandeCongeService.getAllDemandesCongesByEmployee(employe);
            demandeConges.addAll(employeeDemands);
        }

        // Return the list of DemandeConge
        return ResponseEntity.ok(demandeConges);
    }

    @GetMapping("/get-employe-by-demande/{id}")
    public ResponseEntity<Employe> getEmployeByDemandeConge(@PathVariable Integer id){
        Employe employe=demandeCongeService.getEmployeByDemandeConge(demandeCongeRepo.findById(id).get());
        return ResponseEntity.ok(employe);
    }

    @GetMapping("/refuser-demande/{id}")
    public ResponseEntity<?> refuserDemande(@PathVariable Integer id){
        demandeCongeService.refuseDemande(id);
        return ResponseEntity.ok(Map.of("message","Demande de congé refusée avec succès"));

    }

    @GetMapping("/approuve-demande/{id}")
    public ResponseEntity<?> approuverDemande(@PathVariable Integer id){
        DemandeConge demandeConge=demandeCongeRepo.findById(id).get();
        if(demandeConge.getTypeConge().getAffecteSoldeConge()){
            demandeCongeService.approuveDemandeSolde(demandeConge);
            return ResponseEntity.ok(Map.of("message","Demande de congé approuvée avec succès."));
        }else{
            demandeCongeService.approuveDemande(demandeConge);
            return ResponseEntity.ok(Map.of("message","Demande de congé approuvée avec succès."));

        }
    }

}
