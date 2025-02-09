package com.gestionConges.backend.gestionConges.service;

import com.gestionConges.backend.gestionConges.model.Notification;
import com.gestionConges.backend.gestionConges.repository.NotifRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotifService {

    @Autowired
    private NotifRepo notifRepo;

    public void updateIsReadNotif(Integer id){
        Notification notification = notifRepo.findById(id).orElseThrow(() ->
                new IllegalArgumentException("Notification non trouvée pour cet ID"));
        notification.setIs_read(true);
        notifRepo.save(notification);
    }
}
