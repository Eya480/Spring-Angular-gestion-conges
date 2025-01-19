package com.gestionConges.backend.gestionConges.model;

import jakarta.persistence.*;


@Entity
@Table(name = "TypeConge")
public class TypeConge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idTypeConge;
    private String nomTypeConge;
    private String descriptionC;
    @ManyToOne
    @JoinColumn(name = "adminRH_id")
    private AdminRH adminRH; // Relation Many-to-One avec AdminRH
}
