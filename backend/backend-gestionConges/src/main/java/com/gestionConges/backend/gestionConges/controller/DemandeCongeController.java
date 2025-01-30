package com.gestionConges.backend.gestionConges.controller;

import com.gestionConges.backend.gestionConges.model.DemandeConge;
import com.gestionConges.backend.gestionConges.repository.DemandeCongeRepo;
import com.gestionConges.backend.gestionConges.repository.EmployeeRepo;
import com.gestionConges.backend.gestionConges.repository.TypeCongeRepo;
import com.gestionConges.backend.gestionConges.service.DemandeCongeService;
import com.gestionConges.backend.gestionConges.service.EmployeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/demande-conges")
public class DemandeCongeController {

    @Autowired
    private TypeCongeRepo typeCongeRepo;

    @Autowired
    private DemandeCongeService demandeCongeService;

    @Autowired
    private EmployeService employeService;

    @Autowired
    private DemandeCongeRepo demandeCongeRepo;

    @Autowired
    private EmployeeRepo employeeRepo;

    @GetMapping("/get-all")
    public ResponseEntity<List<DemandeConge>> getAllDemandeCongeByEmploye() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        List<DemandeConge> demandes = employeService.getAllDemandeCongeByEmploye(email);
        if (!demandes.isEmpty()) {
            return new ResponseEntity<>(demandes, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }



    //
    @PostMapping
    public ResponseEntity<?> soumettreDemandeConge(@RequestBody DemandeConge demandeConge) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        demandeConge.setTypeConge(typeCongeRepo.findByNomTypeConge(demandeConge.getTypeConge().getNomTypeConge()));

        LocalDate dateLimite = LocalDate.now().plusWeeks(2);
        if(demandeConge.getTypeConge().getAffecteSoldeConge()){
            if(!demandeCongeService.verifierSoldeRestant(email, ChronoUnit.DAYS.between(demandeConge.getDateDebut(),demandeConge.getDateFin())+1)){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Solde de Congé insuffisant.");
            }
        }
        if (demandeConge.getDateDebut().isBefore(dateLimite)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La date de début doit être dans au moins 2 semaines à partir d'aujourd'hui.");
        }

        if (demandeConge.getDateDebut().isAfter(demandeConge.getDateFin())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La date de début ne peut pas être postérieure à la date de fin.");
        }


        demandeCongeService.soumettreUneDemande(demandeConge, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(demandeConge);

    }

    @GetMapping("/{id}")
    public DemandeConge getDemandeCongeById(@PathVariable Integer id) {
        return demandeCongeService.getDemandeCongeById(id);
    }

    @PutMapping("/modifierDemande/{idD}")
    public ResponseEntity<?> modifierDemandeConge(@PathVariable Integer idD, @RequestBody DemandeConge newDemandeC) {
        if (newDemandeC.getTypeConge() != null) {
            Boolean affecteSolde = newDemandeC.getTypeConge().getAffecteSoldeConge();
            if (Boolean.TRUE.equals(affecteSolde)) { // Vérification propre
                if (!demandeCongeService.verifierSoldeRestant(
                        demandeCongeRepo.findDemandeCongeByIdDemande(idD).getEmploye().getEmail(),
                        ChronoUnit.DAYS.between(newDemandeC.getDateDebut(), newDemandeC.getDateFin()) + 1)) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Solde de Congé insuffisant.");
                }
            }
        }

        try {
            demandeCongeService.modifierDemandeConge(idD, newDemandeC);
            return ResponseEntity.ok(Map.of("message", "Demande de congé modifiée avec succès"));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("La demande ne peut être modifiée que si elle est en attente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur interne du serveur");
        }
    }


    @DeleteMapping("/delete/{idD}")
    public ResponseEntity<?> supprimerDemandeConge(@PathVariable Integer idD) {
        try {
            demandeCongeService.supprimerDemandeConge(idD);
            return ResponseEntity.ok(Map.of("message","Demande de congé supprimée avec succès"));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("La demande ne peut être supprimée que si elle est en attente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur interne du serveur");
        }
    }


    @PutMapping("/{idD}/extension")
    public ResponseEntity<?> demanderExtensionConge(
            @PathVariable Integer idD,
            @RequestBody DemandeConge extensionReq) {

        try {
            DemandeConge demandeC=demandeCongeRepo.findDemandeCongeByIdDemande(idD);
            if(demandeC.getTypeConge()!=null) {
                if (Boolean.TRUE.equals(demandeC.getTypeConge().getAffecteSoldeConge())) {
                    if (!demandeCongeService.verifierSoldeRestant(demandeC.getEmploye().getEmail(),
                            ChronoUnit.DAYS.between(demandeC.getDateDebut(), demandeC.getDateFin()) + 1)) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Solde de Congé insuffisant.");
                    }
                }
            }
            demandeCongeService.demanderExtensionConge(demandeC, extensionReq.getDateFin(), extensionReq.getReason());
            return ResponseEntity.ok(Map.of("message","Extension de congé demandée avec succès."));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}
