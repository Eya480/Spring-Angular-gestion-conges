package com.gestionConges.backend.gestionConges.model;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "Departement")
public class Departement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idDep;

    private String nomDep;

    private String description;

    @OneToMany(mappedBy = "departement", fetch = FetchType.EAGER)
    @JsonIgnore
    private List<Employe> employes;

    @OneToOne(mappedBy = "departement", fetch = FetchType.EAGER)
    @JsonIgnore
    private Manager manager; // Un seul manager par département

    // Getters et Setters

    public Integer getIdDep() {
        return idDep;
    }

    public void setIdDep(Integer idDep) {
        this.idDep = idDep;
    }

    public String getNomDep() {
        return nomDep;
    }

    public void setNomDep(String nomDep) {
        this.nomDep = nomDep;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Employe> getEmployes() {
        return employes;
    }

    public void setEmployes(List<Employe> employes) {
        this.employes = employes;
    }

    public Manager getManager() {
        return manager;
    }

    public void setManager(Manager manager) {
        this.manager = manager;
    }
}