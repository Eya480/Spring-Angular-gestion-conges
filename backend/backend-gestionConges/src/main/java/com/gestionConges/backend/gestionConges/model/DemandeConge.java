package com.gestionConges.backend.gestionConges.model;

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

    private int nbJour;
    @Enumerated(EnumType.STRING)
    private EtatDemande statut;
    @ManyToOne
    @JoinColumn(name = "typeConge_id")
    private TypeConge typeConge;
    @ManyToOne
    @JoinColumn(name = "employe_id")
    private Employe employe; // La demande est faite par un employé

    @ManyToOne
    @JoinColumn(name = "manager_id")
    private Manager manager; // La demande est traitée par un manager
}