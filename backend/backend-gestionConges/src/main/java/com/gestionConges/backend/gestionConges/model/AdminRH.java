package com.gestionConges.backend.gestionConges.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "AdminRH")
public class AdminRH extends Personnel{
    @OneToMany(mappedBy = "adminRH", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore
    private List<Employe> lesEmployes;

    @OneToMany(mappedBy = "adminRH", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore
    private List<TypeConge> LesTypesConges;

    @OneToMany(mappedBy = "adminRH", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore
    private List<Rapport> rapports; // Un AdminRH peut gérer plusieurs rapports


    // Getters et Setters

    public List<Employe> getLesEmployes() {
        return lesEmployes;
    }

    public void setLesEmployes(List<Employe> lesEmployes) {
        this.lesEmployes = lesEmployes;
    }

    public List<TypeConge> getLesTypesConges() {
        return LesTypesConges;
    }

    public void setLesTypesConges(List<TypeConge> LesTypesConges) {
        this.LesTypesConges = LesTypesConges;
    }

    public List<Rapport> getRapports() {
        return rapports;
    }

    public void setRapports(List<Rapport> rapports) {
        this.rapports = rapports;
    }
}
