package com.gestionConges.backend.gestionConges.model;

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
    private Departement departement;
    @ManyToOne
    @JoinColumn(name = "adminRH_id")
    private AdminRH adminRH; // Un rapport est géré par un AdminRH
}
