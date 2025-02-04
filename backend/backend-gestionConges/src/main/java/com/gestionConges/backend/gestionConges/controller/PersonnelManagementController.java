package com.gestionConges.backend.gestionConges.controller;

import com.gestionConges.backend.gestionConges.dto.ReqRes;
import com.gestionConges.backend.gestionConges.model.*;
import com.gestionConges.backend.gestionConges.service.PersonnelManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class PersonnelManagementController {
    @Autowired
    private PersonnelManagementService personnelManagementService;

    @GetMapping("/UserManager/get-all-notif")
    public ResponseEntity<List<Notification>> getAllNotifByPersonnel(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return new ResponseEntity<>( personnelManagementService.getAllNotifByPersonnel(email),HttpStatus.OK);
    }

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

    @GetMapping("/admin/getUserById/{id}")
    public ResponseEntity<Personnel> getUserById(@PathVariable Integer id){
        Personnel user=personnelManagementService.getPersonnelById(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/admin/modifierUser/{id}")
    public ResponseEntity<?> modifierUser(@PathVariable Integer id, @RequestBody Personnel personnel) {

        try {
            personnelManagementService.updatePersonnel(id, personnel);
            return ResponseEntity.ok(Map.of("message", "User modifier avec succés"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur interne du serveur");
        }
    }

    @PutMapping("/admin/modifierRole/{id}")
    public ResponseEntity<?> modifierRole(@PathVariable Integer id,
                                          @RequestBody Role newRole,
                                          @RequestParam String nomDep) {
        try {
            System.out.println("Requête reçue : id=" + id + ", role=" + newRole + ", nomDep=" + nomDep);
            personnelManagementService.updateRole(id, newRole, nomDep);
            return ResponseEntity.ok(Map.of("message", "Rôle modifié avec succès"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur interne du serveur");
        }
    }




    @PostMapping("/admin/createUser")
    public ResponseEntity<ReqRes> createUser(@RequestBody ReqRes registrationRequest){
        return ResponseEntity.ok(personnelManagementService.register(registrationRequest));


    }


    @DeleteMapping("/admin/deleteUser/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {

        try {
            personnelManagementService.deletePersonnel(id);
            return ResponseEntity.ok(Map.of("message", "User supprimé avec succés"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur interne du serveur");
        }
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
