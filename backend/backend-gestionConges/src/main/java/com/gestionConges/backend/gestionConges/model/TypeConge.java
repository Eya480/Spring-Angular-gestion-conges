package com.gestionConges.backend.gestionConges.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;


@Entity
@Table(name = "TypeConge")
public class TypeConge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idTypeConge;
    private String nomTypeConge;
    private String descriptionC;
    private int nbCongeMax;
    private Boolean affecteSoldeConge;

    @ManyToOne
    @JoinColumn(name = "adminRH_id")
    @JsonIgnore
    private AdminRH adminRH; // Relation Many-to-One avec AdminRH

    public Boolean getAffecteSoldeConge() {
        return this.affecteSoldeConge;
    }

    public void setConsommeSoldee(Boolean consommeSolde) {
        this.affecteSoldeConge = consommeSolde;
    }

    public int getnbCongeMax() {
        return this.nbCongeMax;
    }

    public void setnbCongeMax(int nbCongeMax) {
        this.nbCongeMax = nbCongeMax;
    }

    public Integer getIdTypeConge() {
        return idTypeConge;
    }

    public void setIdTypeConge(Integer idTypeConge) {
        this.idTypeConge = idTypeConge;
    }

    public String getNomTypeConge() {
        return nomTypeConge;
    }

    public void setNomTypeConge(String nomTypeConge) {
        this.nomTypeConge = nomTypeConge;
    }

    public String getDescriptionC() {
        return descriptionC;
    }

    public void setDescriptionC(String descriptionC) {
        this.descriptionC = descriptionC;
    }

    public AdminRH getAdminRH() {
        return adminRH;
    }

    public void setAdminRH(AdminRH adminRH) {
        this.adminRH = adminRH;
    }
}
