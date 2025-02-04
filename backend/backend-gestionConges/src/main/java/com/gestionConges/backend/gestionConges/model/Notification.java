package com.gestionConges.backend.gestionConges.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "Notification")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idNotif;
    private String contenu;
    private LocalDateTime dateEnvoi;
    @ManyToOne
    @JoinColumn(name = "personnel_id", nullable = false)
    private Personnel destinataire;

    public Integer getIdNotif() {
        return idNotif;
    }

    public void setIdNotif(Integer idNotif) {
        this.idNotif = idNotif;
    }

    public LocalDateTime getDateEnvoi() {
        return dateEnvoi;
    }

    public void setDateEnvoi(LocalDateTime dateEnvoi) {
        this.dateEnvoi = dateEnvoi;
    }

    public String getContenu() {
        return contenu;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }

    public Personnel getDestinataire() {
        return destinataire;
    }

    public void setDestinataire(Personnel destinataire) {
        this.destinataire = destinataire;
    }
}
