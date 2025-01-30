package com.gestionConges.backend.gestionConges.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "Rapport")
public class Rapport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idRapport;

    private String contenu;

    private int annee;

    private LocalDateTime dateGeneration;

    @ManyToOne
    @JoinColumn(name = "departement_id")
    @JsonIgnore
    private Departement departement;

    @ManyToOne
    @JoinColumn(name = "adminRH_id")
    @JsonIgnore
    private AdminRH adminRH; // Un rapport est géré par un AdminRH
}
