package com.gestionConges.backend.gestionConges.controller;

import com.gestionConges.backend.gestionConges.dto.ReqRes;
import com.gestionConges.backend.gestionConges.model.DemandeConge;
import com.gestionConges.backend.gestionConges.model.Employe;
import com.gestionConges.backend.gestionConges.model.Manager;
import com.gestionConges.backend.gestionConges.repository.ManagerRepo;
import com.gestionConges.backend.gestionConges.service.DemandeCongeService;
import com.gestionConges.backend.gestionConges.service.DepartementService;
import com.gestionConges.backend.gestionConges.service.EmployeService;
import com.gestionConges.backend.gestionConges.service.PersonnelManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeController {

    @Autowired
    private EmployeService employeService;

    @Autowired
    private PersonnelManagementService personnelManagementService;

    @Autowired
    private DepartementService departementService;

    @Autowired
    private DemandeCongeService demandeCongeService;

    @GetMapping
    public List<Employe> getAllEmployees() {
        return personnelManagementService.getAllEmployees();
    }

    @GetMapping("/{id}")
    public Employe getEmployeeById(@PathVariable Integer id) {
        return employeService.getEmployeById(id);
    }

    @GetMapping("/Manager/{id}")
    public Manager getManagerByDepId(@PathVariable Integer id) {
        return departementService.getManagerByDepartement(id);
    }

    @GetMapping("/demandeByManagerId/{id}")
    public ResponseEntity<List<DemandeConge>>  getDemandeByManagerId(@PathVariable Integer id) {
        return new ResponseEntity<>(demandeCongeService.getAllByManager(id), HttpStatus.OK);
    }

    @PostMapping("/create-employee")
    public ResponseEntity<ReqRes> createEmployee(@RequestBody ReqRes registrationRequest){
        return ResponseEntity.ok(personnelManagementService.register(registrationRequest));


    }

    @PutMapping("/update-employee/{id}")
    public ResponseEntity<ReqRes> updateEmployee(@PathVariable Integer id,@RequestBody Employe employe){
        return ResponseEntity.ok(personnelManagementService.updatePersonnel(id,employe));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ReqRes> deleteEmployee(@PathVariable Integer id){
        return ResponseEntity.ok(personnelManagementService.deletePersonnel(id));
    }



}
