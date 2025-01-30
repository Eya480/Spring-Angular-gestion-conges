package com.gestionConges.backend.gestionConges.controller;

import com.gestionConges.backend.gestionConges.dto.ReqRes;
import com.gestionConges.backend.gestionConges.model.AdminRH;
import com.gestionConges.backend.gestionConges.service.AdminRhService;
import com.gestionConges.backend.gestionConges.service.PersonnelManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/adminRH")
public class AdminRhController {

    @Autowired
    private AdminRhService adminRhService;

    @Autowired
    private PersonnelManagementService personnelManagementService;

    @GetMapping
    public List<AdminRH> getAllAdminRH(){
        return adminRhService.getAllAdminRH();
    }

    @PostMapping
    public ResponseEntity<ReqRes> createAdminRH(@RequestBody ReqRes registrationRequest){
        return ResponseEntity.ok(personnelManagementService.register(registrationRequest));


    }

}
