package com.gestionConges.backend.gestionConges.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "Employe")
@Data
@EqualsAndHashCode(callSuper = true)
public class Employe extends Personnel {
    @ManyToOne
    @JoinColumn(name = "manager_id")
    private Manager manager;

    @ManyToOne
    @JoinColumn(name = "adminRH_id") // Utilisez un seul mapping pour AdminRH
    private AdminRH adminRH;

    private int soldeCongé;
    private int nbJoursConsommés;
    private int joursRestantAnnéePrecedante;
    private LocalDate dateEmbauche;
    private String poste;
    private int nbJoursAnnuels;

    @ManyToOne
    @JoinColumn(name = "departement_id")
    private Departement departement;

    @OneToMany(mappedBy = "employe", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DemandeConge> LesDemandeConges;
}