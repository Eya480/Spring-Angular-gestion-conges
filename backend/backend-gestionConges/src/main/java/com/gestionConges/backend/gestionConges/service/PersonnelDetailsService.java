package com.gestionConges.backend.gestionConges.service;

import com.gestionConges.backend.gestionConges.repository.PersonnelRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

//pour charger un utilisateur à
// partir de la base de données en fonction de son email (utilisé comme username
@Service
public class PersonnelDetailsService implements UserDetailsService {
    @Autowired
    private PersonnelRepo PersonnelRepo;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return PersonnelRepo.findByEmail(username).orElseThrow();
    }
}
