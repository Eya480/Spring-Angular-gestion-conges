package com.gestionConges.backend.gestionConges.controller;

import com.gestionConges.backend.gestionConges.model.TypeConge;
import com.gestionConges.backend.gestionConges.service.TypeCongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/typeConges")
public class TypeCongesController {

    @Autowired
    private TypeCongService typeCongService;

    @GetMapping("/get-all")
    public ResponseEntity<List<TypeConge>> getAllTypesC(){
        List<TypeConge> typeConges=typeCongService.getAllTypeConge();
        return ResponseEntity.ok(typeConges);
    }

    @PostMapping("/create-TypeConges")
    public ResponseEntity<?> createTypeC(@RequestBody TypeConge typeConge) {
        try {
            TypeConge newTypeC = typeCongService.createTypeC(typeConge);
            return ResponseEntity.status(HttpStatus.CREATED).body(newTypeC);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de la création du Type Conges.");
        }}

    @DeleteMapping("/delete-typeC/{id}")
    public ResponseEntity<?> deleteTypeC(@PathVariable Integer id) {
        try {
            typeCongService.deleteTypeConge(id);
            return ResponseEntity.ok(Map.of("message", "Type congé supprimé avec succès"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Erreur interne du serveur"));
        }
    }




}
