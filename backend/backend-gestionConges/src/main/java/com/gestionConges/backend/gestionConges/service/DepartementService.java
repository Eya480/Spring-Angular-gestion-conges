package com.gestionConges.backend.gestionConges.service;

import com.gestionConges.backend.gestionConges.model.Departement;
import com.gestionConges.backend.gestionConges.model.Manager;
import com.gestionConges.backend.gestionConges.repository.DepartementRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartementService {

    @Autowired
    private DepartementRepo departementRepo;

    public List<Departement> getAllDepartments(){
        return departementRepo.findAll();
    }

    public Departement createDepartement(Departement dep){
        if (departementRepo.findByNomDep(dep.getNomDep())!=null){
            throw new RuntimeException("Un département avec ce nom existe déjà.");
        }
        return departementRepo.save(dep);
    }

    public void deleteDepartement(Integer id){
        Departement dep=departementRepo.findById(id).orElseThrow(()->new RuntimeException("Département non trouvé avec l'ID : \" + id"));
        departementRepo.delete(dep);
    }

    public Manager getManagerByDepartement(Integer id){
            Departement departement=departementRepo.findById(id).orElseThrow(()->new RuntimeException("departement non trouvé avec ce ID"));
            return departement.getManager();
    }

}
