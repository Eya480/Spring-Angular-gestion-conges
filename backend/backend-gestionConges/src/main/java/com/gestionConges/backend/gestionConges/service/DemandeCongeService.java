package com.gestionConges.backend.gestionConges.service;

import com.gestionConges.backend.gestionConges.model.*;
import com.gestionConges.backend.gestionConges.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class DemandeCongeService {

    @Autowired
    private DemandeCongeRepo demandeCongeRepo;

    @Autowired
    private NotifRepo notifRepo;

    @Autowired
    private ManagerRepo managerRepo;

    @Autowired
    private EmployeeRepo employeeRepo;

    @Autowired
    private TypeCongeRepo typeCongeRepo;



    //Employé
    // => verification du solde est valid (selon typeConge)
    public void soumettreUneDemande(DemandeConge demandeConge , String email){
        Employe employe=employeeRepo.findByEmail(email);

        long thisYear=LocalDate.now().getYear();
        if(thisYear!=demandeConge.getDateFin().getYear()){
            employe.setSoldeRestant(0);
            employe.setSoldeConsommes(0);
            employe.setSoldeRestant(employe.getSoldeInitial());
        }

        demandeConge.setManager(employe.getManager());
        demandeConge.setEmploye(employe);
        demandeConge.setStatut(EtatDemande.En_Attente);

        employe.getLesDemandeConges().add(demandeConge);

        Notification notification= new Notification();
        notification.setDateEnvoi(LocalDateTime.now());
        notification.setDestinataire(demandeConge.getManager());
        notification.setContenu(employe.getNom() + " a soumis une demande de congé pour le " + LocalDate.now() + ". Motif : " + demandeConge.getReason() + ".");


        notifRepo.save(notification);
        demandeCongeRepo.save(demandeConge);



    }

    // verification du solde => typeConge : affecteSoldeConge=true
    public Boolean verifierSoldeRestant(String email,long nbJourSouhaite) {
        float soldeRestant = employeeRepo.findByEmail(email).getSoldeRestant();
        return soldeRestant >= nbJourSouhaite;

    }

    public DemandeConge getDemandeCongeById(Integer id) {
        Optional<DemandeConge> optionalDemandeConge = demandeCongeRepo.findById(id);
        return optionalDemandeConge.get();
    }

    public void modifierDemandeConge(Integer idD,DemandeConge newDemandeC){
        DemandeConge demandeConge=demandeCongeRepo.findDemandeCongeByIdDemande(idD);

        System.out.println("Données reçues : " + newDemandeC.toString());
        if (demandeConge.getStatut()!=EtatDemande.En_Attente) {
            throw new IllegalStateException("La demande de congé ne peut être modifiée que si elle est en attente");
        }
        if (newDemandeC.getDateDebut().isAfter(newDemandeC.getDateFin())) {
            throw new IllegalArgumentException("La date de début ne peut pas être après la date de fin");
        }

        TypeConge typeConge=typeCongeRepo.findByNomTypeConge(newDemandeC.getTypeConge().getNomTypeConge());
        demandeConge.setTypeConge(typeConge);
        demandeConge.setReason(newDemandeC.getReason());
        demandeConge.setDateDebut(newDemandeC.getDateDebut());
        demandeConge.setDateFin(newDemandeC.getDateFin());



        demandeCongeRepo.save(demandeConge);
    }

    public void supprimerDemandeConge(Integer idD) {
        DemandeConge demandeConge = demandeCongeRepo.findDemandeCongeByIdDemande(idD);

        if (demandeConge.getStatut()!=EtatDemande.En_Attente) {
            throw new IllegalStateException("La demande de congé ne peut être supprimée que si elle est en attente");
        }

        demandeCongeRepo.delete(demandeConge);
    }

        public void demanderExtensionConge(DemandeConge demandeConge, LocalDate nouvelleDateFin,String newReason) {

        if (demandeConge.getStatut()!=EtatDemande.Approuve) {
            throw new IllegalStateException("La demande de congé doit être approuvée avant de demander une extension");
        }

        if (nouvelleDateFin.isBefore(demandeConge.getDateFin())) {
            throw new IllegalArgumentException("La nouvelle date de fin doit être postérieure à la date de fin initiale");
        }

        demandeConge.setStatut(EtatDemande.En_Attente);
        demandeConge.setEstDExtension(true);
        demandeConge.setDateFin(nouvelleDateFin);
        if (newReason!=""){demandeConge.setReason(newReason);}

        demandeCongeRepo.save(demandeConge);
    }

    public List<DemandeConge> getAllByManager(Integer id){
        return demandeCongeRepo.findByManager(managerRepo.findById(id).orElse(null));
    }

    //Manager
    public List<DemandeConge> getAllDemandesCongesByEmployee(Employe employe){
        return demandeCongeRepo.findByEmploye(employe);
    }

    public void approuveDemandeSolde(DemandeConge demandeConge){

        demandeConge.setStatut(EtatDemande.Approuve);
        //mettre à jour le cumule
        demandeConge.getEmploye().setsoldeCumule();
        demandeConge.setEstDExtension(false);
        demandeConge.getEmploye().setSoldeConsommes((int)(ChronoUnit.DAYS.between(demandeConge.getDateDebut(), demandeConge.getDateFin()) + 1));
        demandeConge.getEmploye().setSoldeRestant(demandeConge.getEmploye().getSoldeRestant()-demandeConge.getEmploye().getSoldeConsommes());

        Notification notification= new Notification();
        notification.setDateEnvoi(LocalDateTime.now());
        notification.setDestinataire(demandeConge.getEmploye());
        notification.setIs_read(false);
        notification.setContenu("Le manager de votre département a validé votre demande de congé, GO AND CHECK !");

        notifRepo.save(notification);

        demandeCongeRepo.save(demandeConge);

        employeeRepo.save(demandeConge.getEmploye());
    }

    public void approuveDemande(DemandeConge demandeConge){
        demandeConge.setStatut(EtatDemande.Approuve);
        demandeConge.setEstDExtension(false);

        Notification notification= new Notification();
        notification.setDateEnvoi(LocalDateTime.now());
        notification.setDestinataire(demandeConge.getEmploye());
        notification.setIs_read(false);
        notification.setContenu("Le manager de votre département a validé votre demande de congé, GO AND CHECK !");

        notifRepo.save(notification);

        demandeCongeRepo.save(demandeConge);
    }

    public void refuseDemande(Integer id){
        DemandeConge demandeConge=demandeCongeRepo.findById(id).get();
        demandeConge.setEstDExtension(false);
        demandeConge.setStatut(EtatDemande.Refuse);

        Notification notification= new Notification();
        notification.setDateEnvoi(LocalDateTime.now());
        notification.setDestinataire(demandeConge.getEmploye());
        notification.setIs_read(false);
        notification.setContenu("Le manager de votre département a Réfusé votre demande de congé, GO AND CHECK !");

        notifRepo.save(notification);

        demandeCongeRepo.save(demandeConge);


    }

    public Employe getEmployeByDemandeConge(DemandeConge demandeConge) {
        return demandeCongeRepo.findEmployeByDemandeConge(demandeConge);
    }











}
