package com.gestionConges.backend.gestionConges.repository;

import com.gestionConges.backend.gestionConges.model.AdminRH;
import com.gestionConges.backend.gestionConges.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotifRepo extends JpaRepository<Notification,Integer> {
}
