package com.gestionConges.backend.gestionConges.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "AdminRH")
public class AdminRH extends Personnel{
    @OneToMany(mappedBy = "adminRH", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Employe> lesEmployes;
    @OneToMany(mappedBy = "adminRH", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TypeConge> LesTypesConges;
    @OneToMany(mappedBy = "adminRH", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Rapport> rapports; // Un AdminRH peut gérer plusieurs rapports
}
