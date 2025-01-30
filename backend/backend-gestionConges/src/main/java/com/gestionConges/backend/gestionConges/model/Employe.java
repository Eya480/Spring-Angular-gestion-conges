package com.gestionConges.backend.gestionConges.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Entity
@Table(name = "Employe")
@Data
@EqualsAndHashCode(callSuper = true)
public class Employe extends Personnel {
    @ManyToOne
    @JoinColumn(name = "manager_id")
    @JsonIgnore
    private Manager manager;

    @ManyToOne
    @JoinColumn(name = "adminRH_id")// Utilisez un seul mapping pour AdminRH
    @JsonIgnore
    private AdminRH adminRH;
    private int soldeCumule;// a ce mois en cours
    private long soldeConsommes;
    private LocalDate dateEmbauche;
    private String poste;
    private int soldeInitial;
    @JsonProperty
    private float soldeRestant;

    @ManyToOne
    @JoinColumn(name = "departement_id")
    private Departement departement;

    @OneToMany(mappedBy = "employe", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore
    private List<DemandeConge> LesDemandeConges;

    public Employe(){
        this.soldeInitial=30;
        this.soldeConsommes=0; // si ce solde est mis a jour le solde restant kifkif
        this.soldeRestant=30;
    }

    public Manager getManager() {
        return manager;
    }

    public void setManager(Manager manager) {
        this.manager = manager;
    }

    public AdminRH getAdminRH() {
        return adminRH;
    }

    public void setAdminRH(AdminRH adminRH) {
        this.adminRH = adminRH;
    }

    public float getSoldeCumule() {
        return soldeCumule;
    }
    public void setSoldeCumule(int soldeCumule){this.soldeCumule = soldeCumule;}

    public long getSoldeConsommes() {
        return soldeConsommes;
    }

    public void setSoldeConsommes(int soldeConsommes) {
        this.soldeConsommes = soldeConsommes;
    }

    public int getSoldeInitial() {
        return soldeInitial;
    }

    public void setSoldeInitial(int soldeInitial) {
        this.soldeInitial = soldeInitial;
    }

    public LocalDate getDateEmbauche() {
        return dateEmbauche;
    }

    public void setDateEmbauche(LocalDate dateEmbauche) {
        this.dateEmbauche = dateEmbauche;
    }

    public String getPoste() {
        return poste;
    }

    public void setPoste(String poste) {
        this.poste = poste;
    }

    public void setsoldeCumule() {
        LocalDate dateActuelle = LocalDate.now();
        LocalDate dateEmbauche = this.getDateEmbauche();  // Date d'embauche de l'employé

        long moisEnCours;
        if (dateEmbauche.getYear() == dateActuelle.getYear()) {
            moisEnCours = ChronoUnit.MONTHS.between(dateEmbauche, dateActuelle);
            // Si l'embauche est dans le mois en cours, on le considère comme le mois 1 pour les congés
            if (dateEmbauche.getMonthValue() == dateActuelle.getMonthValue()) {
                moisEnCours = 1;  // L'employé commence à accumuler des congés dès son premier mois
            }
        } else {
            moisEnCours = dateActuelle.getMonthValue();  // Nombre de mois de l'année en cours
        }

        // Calcul du solde cumulé des congés en fonction des mois travaillés
        int soldeCumule = (int)((this.soldeInitial / 12f) * moisEnCours);
        this.setSoldeCumule(soldeCumule);
    }

    public float getSoldeRestant(){return this.soldeRestant;}

    public void setSoldeRestant(float soldeRestant) {
        this.soldeRestant = soldeRestant;
    }

    public Departement getDepartement() {
        return departement;
    }

    public void setDepartement(Departement departement) {
        this.departement = departement;
    }

    public List<DemandeConge> getLesDemandeConges() {
        return LesDemandeConges;
    }

    public void setLesDemandeConges(List<DemandeConge> LesDemandeConges) {
        this.LesDemandeConges = LesDemandeConges;
    }
}