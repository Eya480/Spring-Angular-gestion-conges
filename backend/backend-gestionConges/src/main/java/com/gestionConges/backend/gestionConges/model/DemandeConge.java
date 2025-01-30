package com.gestionConges.backend.gestionConges.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "DemandeConge")
public class DemandeConge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idDemande;

    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String reason;
    @Enumerated(EnumType.STRING)
    private EtatDemande statut;

    @ManyToOne
    @JoinColumn(name = "typeConge_id")
    private TypeConge typeConge;

    private Boolean estDExtension;

    @ManyToOne
    @JoinColumn(name = "employe_id")
    @JsonIgnore
    private Employe employe; // La demande est faite par un employé

    @ManyToOne
    @JoinColumn(name = "manager_id")
    @JsonIgnore
    private Manager manager; // La demande est traitée par un manager

    public DemandeConge(){
        this.estDExtension=false;
    }

    public Integer getIdDemande() {
        return idDemande;
    }

    public void setIdDemande(Integer idDemande) {
        this.idDemande = idDemande;
    }

    public LocalDate getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFin() {
        return dateFin;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }


    public EtatDemande getStatut() {
        return statut;
    }

    public void setStatut(EtatDemande statut) {
        this.statut = statut;
    }

    public TypeConge getTypeConge() {
        return typeConge;
    }

    public void setTypeConge(TypeConge typeConge) {
        this.typeConge = typeConge;
    }
    public Boolean getEstDExtension() {
        return estDExtension;
    }

    public void setEstDExtension(Boolean estDExtension) {
        this.estDExtension = estDExtension;
    }

    public Employe getEmploye() {
        return employe;
    }

    public void setEmploye(Employe employe) {
        this.employe = employe;
    }

    public Manager getManager() {
        return manager;
    }

    public void setManager(Manager manager) {
        this.manager = manager;
    }

}