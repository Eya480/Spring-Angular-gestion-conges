package com.gestionConges.backend.gestionConges.controller;

import com.gestionConges.backend.gestionConges.dto.ReqRes;
import com.gestionConges.backend.gestionConges.model.Personnel;
import com.gestionConges.backend.gestionConges.service.PersonnelManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
public class PersonnelManagementController {
    @Autowired
    private PersonnelManagementService personnelManagementService;

    @PostMapping("/auth/register")
    public ResponseEntity<ReqRes> register(@RequestBody ReqRes req) {
        ReqRes response = new ReqRes();
        try {
            response = personnelManagementService.register(req);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Log the error
            e.printStackTrace();
            // Return a detailed error response
            response.setStatusCode(500);
            response.setError("Internal Server Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PostMapping("/auth/login")
    public ResponseEntity<ReqRes> login(@RequestBody ReqRes req){
        return ResponseEntity.ok(personnelManagementService.login(req));
    }
    @PostMapping("/auth/refresh")
    public ResponseEntity<ReqRes> refrechToken(@RequestBody ReqRes req){
        return ResponseEntity.ok(personnelManagementService.refreshToken(req));
    }

    @GetMapping("/admin/get-all-users")
    public ResponseEntity<ReqRes> getAllUsers(){
        return ResponseEntity.ok(personnelManagementService.getAllPersonnel());
    }

    @GetMapping("/adminRhUserManagerAdmin/get-profile")
    public ResponseEntity<ReqRes> getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        ReqRes response = personnelManagementService.getMyInfo(email);
        //System.out.println("aslema :" + response.getEmploye());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

}
