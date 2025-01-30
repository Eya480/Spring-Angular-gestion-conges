package com.gestionConges.backend.gestionConges.controller;

import com.gestionConges.backend.gestionConges.dto.ReqRes;
import com.gestionConges.backend.gestionConges.model.Departement;
import com.gestionConges.backend.gestionConges.service.DepartementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/departements")
public class DepartementController {

    @Autowired
    private DepartementService departementService;

    //endpoint
    @GetMapping("/get-all")
    public ResponseEntity<List<Departement>> getAllDepartements(){
        List<Departement> departements=departementService.getAllDepartments();
        return ResponseEntity.ok(departements);
    }

    @DeleteMapping("/delete-dep/{id}")
    public ResponseEntity<?> deleteDepartement(@PathVariable Integer id){
        try{
            departementService.deleteDepartement(id);
            return ResponseEntity.ok(Map.of("message","Département supprimé avec succès"));
        }catch(RuntimeException e){return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));}
    }

    @PostMapping
    public ResponseEntity<?> createDepartement(@RequestBody Departement departement) {
        try {
            Departement newDepartement = departementService.createDepartement(departement);
            return ResponseEntity.status(HttpStatus.CREATED).body(newDepartement);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de la création du département.");
        }
    }


}
