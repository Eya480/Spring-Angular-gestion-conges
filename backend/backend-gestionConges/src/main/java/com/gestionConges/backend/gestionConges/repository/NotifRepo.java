package com.gestionConges.backend.gestionConges.repository;

import com.gestionConges.backend.gestionConges.model.Notification;
import com.gestionConges.backend.gestionConges.model.Personnel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotifRepo extends JpaRepository<Notification,Integer> {

    List<Notification> getAllNotificationByDestinataire(Personnel personnel);
}
