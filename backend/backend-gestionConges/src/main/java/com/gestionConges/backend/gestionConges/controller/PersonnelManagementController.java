package com.gestionConges.backend.gestionConges.controller;

import com.gestionConges.backend.gestionConges.dto.ReqRes;
import com.gestionConges.backend.gestionConges.model.Personnel;
import com.gestionConges.backend.gestionConges.service.PersonnelManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
public class PersonnelManagementController {
    @Autowired
    private PersonnelManagementService personnelManagementService;

    @PostMapping("/auth/register")
    public ResponseEntity<ReqRes> register(@RequestBody ReqRes req){
        return ResponseEntity.ok(personnelManagementService.register(req));
    }
    @PostMapping("/auth/login")
    public ResponseEntity<ReqRes> login(@RequestBody ReqRes req){
        return ResponseEntity.ok(personnelManagementService.login(req));
    }
    @PostMapping("/auth/refresh")
    public ResponseEntity<ReqRes> refrechToken(@RequestBody ReqRes req){
        return ResponseEntity.ok(personnelManagementService.refreshToken(req));
    }
    //adminRH--PERSONNEL
    @GetMapping("/adminRH/get-all-users")
    public ResponseEntity<ReqRes> getAllUsers(){
        return ResponseEntity.ok(personnelManagementService.getAllPersonnel());
    }
    @GetMapping("/adminRH/get-user/{userId}")
    public ResponseEntity<ReqRes> getUserById(@PathVariable Integer userId){
        return ResponseEntity.ok(personnelManagementService.getPersonnelById(userId));
    }
    @PutMapping("/adminRH/update-user/{userId}")
    public ResponseEntity<ReqRes> updateUser(@PathVariable Integer userId, @RequestBody Personnel p){
        return ResponseEntity.ok(personnelManagementService.updatePersonnel(userId,p));
    }
    @GetMapping("/adminRhUserManager/get-profile")
    public ResponseEntity<ReqRes> getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        ReqRes response = personnelManagementService.getMyInfo(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
    @DeleteMapping("/adminRH/delete-user/{userId}")
    public ResponseEntity<ReqRes> deleteUSer(@PathVariable Integer userId){
        return ResponseEntity.ok(personnelManagementService.deletePersonnel(userId));
    }
}
