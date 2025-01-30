package com.gestionConges.backend.gestionConges.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Entity
@EqualsAndHashCode(callSuper = true)
@Table(name = "Manager")
public class Manager extends Personnel {

    @ManyToOne
    @JoinColumn(name = "departement_id")
    private Departement departement;

    @OneToMany(mappedBy = "manager", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Employe> equipe;

    @OneToMany(mappedBy = "manager", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<DemandeConge> demandesTraitees;

    // Getters and Setters
    public Departement getDepartement() {
        return departement;
    }

    public void setDepartement(Departement departement) {
        this.departement = departement;
    }

    public List<Employe> getEquipe() {
        return equipe;
    }

    public void setEquipe(List<Employe> equipe) {
        this.equipe = equipe;
    }

    public List<DemandeConge> getDemandesTraitees() {
        return demandesTraitees;
    }

    public void setDemandesTraitees(List<DemandeConge> demandesTraitees) {
        this.demandesTraitees = demandesTraitees;
    }
}