package com.gestionConges.backend.gestionConges.service;

import com.gestionConges.backend.gestionConges.model.TypeConge;
import com.gestionConges.backend.gestionConges.repository.AdminRHRepo;
import com.gestionConges.backend.gestionConges.repository.TypeCongeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TypeCongService {

    @Autowired
    private TypeCongeRepo typeCongeRepo;

    @Autowired
    private AdminRHRepo adminRHRepo;

    public List<TypeConge> getAllTypeConge(){
        return typeCongeRepo.findAll();
    }

    public TypeConge createTypeC(TypeConge typeConge){
        if(typeCongeRepo.findByNomTypeConge(typeConge.getNomTypeConge())!=null){
            throw new RuntimeException("Un TypeCongés avec ce nom existe déjà.");
        }
        typeConge.setAdminRH(adminRHRepo.findFirstByOrderByIdAsc());
        return typeCongeRepo.save(typeConge);
    }

    public void deleteTypeConge(Integer id) {
        TypeConge typeConge = typeCongeRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Type congé non trouvé avec l'ID : " + id));
        typeCongeRepo.delete(typeConge);
    }


}
