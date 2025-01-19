package com.gestionConges.backend.gestionConges.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class EmployeController {
    @GetMapping("/employe")
    public String greet(){
        return "Hi employee welcome HERE BODY";
    }
}
