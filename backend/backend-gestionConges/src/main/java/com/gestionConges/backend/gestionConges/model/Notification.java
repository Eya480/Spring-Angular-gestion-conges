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
}
