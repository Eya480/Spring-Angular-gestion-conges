package com.gestionConges.backend.gestionConges.controller;

import com.gestionConges.backend.gestionConges.model.Manager;
import com.gestionConges.backend.gestionConges.service.DepartementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/adminAdminRH")
public class AdminController {

    @Autowired
    private DepartementService departementService;

    @GetMapping("/Manager/{id}")
    public Manager getManagerByDepId(@PathVariable Integer id) {
        return departementService.getManagerByDepartement(id);
    }
}
