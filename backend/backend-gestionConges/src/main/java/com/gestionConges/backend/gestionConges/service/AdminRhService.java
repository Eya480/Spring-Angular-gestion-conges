package com.gestionConges.backend.gestionConges.service;

import com.gestionConges.backend.gestionConges.model.AdminRH;
import com.gestionConges.backend.gestionConges.repository.AdminRHRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminRhService {

    @Autowired
    private AdminRHRepo adminRHRepo;

    public List<AdminRH> getAllAdminRH(){
        return adminRHRepo.findAll();
    }

    public void createAdminRH(AdminRH adminRH){
         adminRHRepo.save(adminRH);
    }




}
