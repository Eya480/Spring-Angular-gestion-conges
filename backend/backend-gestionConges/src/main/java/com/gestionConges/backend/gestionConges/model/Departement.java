package com.gestionConges.backend.gestionConges.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name="Departement")
public class Departement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idDep;
    private String nomDep;
    private String description;
    @OneToMany(mappedBy = "departement", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Employe> employes;
    @OneToOne(mappedBy = "departement", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Manager manager; // Un seul manager par département
}
