package com.gestionConges.backend.gestionConges.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "Manager")
public class Manager extends Personnel{
    @ManyToOne
    @JoinColumn(name = "departement_id")
    private Departement departement;
    @OneToMany(mappedBy = "manager",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private List<Employe> equipe;//Relation One-to-Many avec Employe
    @OneToMany(mappedBy = "manager", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DemandeConge> demandesTraitees; // Un manager peut traiter plusieurs demandes d
}
