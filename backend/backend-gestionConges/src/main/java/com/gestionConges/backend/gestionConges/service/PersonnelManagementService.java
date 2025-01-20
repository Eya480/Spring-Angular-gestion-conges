package com.gestionConges.backend.gestionConges.service;

import com.gestionConges.backend.gestionConges.dto.ReqRes;
import com.gestionConges.backend.gestionConges.model.Personnel;
import com.gestionConges.backend.gestionConges.repository.PersonnelRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class PersonnelManagementService {

    @Autowired
    private PersonnelRepo personnelRepo;

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public ReqRes register(ReqRes registrationRequest) {
        ReqRes resp = new ReqRes();

        try {
            Personnel personnel = new Personnel();
            personnel.setEmail(registrationRequest.getEmail());
            personnel.setNom(registrationRequest.getNom());
            personnel.setPrenom(registrationRequest.getPrenom());
            personnel.setTel(registrationRequest.getTel());
            personnel.setRole(registrationRequest.getRole());
            personnel.setCIN(registrationRequest.getCIN());
            personnel.setPwd(passwordEncoder.encode(registrationRequest.getPwd()));

            Personnel savedPersonnel = personnelRepo.save(personnel);
            if (savedPersonnel.getId() > 0) {
                resp.setPersonnel(savedPersonnel);
                resp.setMessage("Personnel enregistré avec succès");
                resp.setStatusCode(200);
            }

        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public ReqRes login(ReqRes loginRequest) {
        ReqRes response = new ReqRes();
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPwd())
            );
            var personnel = personnelRepo.findByEmail(loginRequest.getEmail()).orElseThrow();
            var jwt = jwtUtils.generateToken(personnel);
            var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), personnel);
            response.setStatusCode(200);
            response.setToken(jwt);
            response.setRole(personnel.getRole());
            response.setRefreshToken(refreshToken);
            response.setExpirationTime("1Hr"); // Durée de vie du token d'accès
            response.setMessage("Connexion réussie");

        } catch (BadCredentialsException e) {
            response.setStatusCode(401); // 401 pour "Bad credentials"
            response.setMessage("Identifiants incorrects");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Erreur interne du serveur : " + e.getMessage());
        }
        return response;
    }

    public ReqRes refreshToken(ReqRes refreshTokenRequest) {
        ReqRes response = new ReqRes();
        try {
            String email = jwtUtils.extractUsername(refreshTokenRequest.getToken());
            Personnel personnel = personnelRepo.findByEmail(email).orElseThrow();
            if (jwtUtils.isTokenValid(refreshTokenRequest.getToken(), personnel)) {
                var jwt = jwtUtils.generateToken(personnel);
                response.setStatusCode(200);
                response.setToken(jwt);
                response.setRefreshToken(refreshTokenRequest.getToken());
                response.setExpirationTime("1Hr"); // Durée de vie du nouveau token d'accès
                response.setMessage("Token rafraîchi avec succès");
            }
            response.setStatusCode(200);
            return response;

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
            return response;
        }
    }

    public ReqRes getAllPersonnel() {
        ReqRes reqRes = new ReqRes();

        try {
            List<Personnel> result = personnelRepo.findAll();
            if (!result.isEmpty()) {
                reqRes.setPersonnelList(result);
                reqRes.setStatusCode(200);
                reqRes.setMessage("Succès");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("Aucun personnel trouvé");
            }
            return reqRes;
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Erreur : " + e.getMessage());
            return reqRes;
        }
    }

    public ReqRes getPersonnelById(Integer id) {
        ReqRes reqRes = new ReqRes();
        try {
            Personnel personnel = personnelRepo.findById(id).orElseThrow(() -> new RuntimeException("Personnel non trouvé"));
            reqRes.setPersonnel(personnel);
            reqRes.setStatusCode(200);
            reqRes.setMessage("Personnel trouvé avec succès");
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Erreur : " + e.getMessage());
        }
        return reqRes;
    }

    public ReqRes deletePersonnel(Integer id) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<Personnel> personnelOptional = personnelRepo.findById(id);
            if (personnelOptional.isPresent()) {
                personnelRepo.deleteById(id);
                reqRes.setStatusCode(200);
                reqRes.setMessage("Personnel supprimé avec succès");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("Personnel non trouvé");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Erreur : " + e.getMessage());
        }
        return reqRes;
    }

    public ReqRes updatePersonnel(Integer id, Personnel updatedPersonnel) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<Personnel> personnelOptional = personnelRepo.findById(id);
            if (personnelOptional.isPresent()) {
                Personnel existingPersonnel = personnelOptional.get();
                existingPersonnel.setEmail(updatedPersonnel.getEmail());
                existingPersonnel.setNom(updatedPersonnel.getNom());
                existingPersonnel.setPrenom(updatedPersonnel.getPrenom());
                existingPersonnel.setCIN(updatedPersonnel.getCIN());
                existingPersonnel.setTel(updatedPersonnel.getTel());
                existingPersonnel.setRole(updatedPersonnel.getRole());

                if (updatedPersonnel.getPwd() != null && !updatedPersonnel.getPwd().isEmpty()) {
                    existingPersonnel.setPwd(passwordEncoder.encode(updatedPersonnel.getPwd()));
                }

                Personnel savedPersonnel = personnelRepo.save(existingPersonnel);
                reqRes.setPersonnel(savedPersonnel);
                reqRes.setStatusCode(200);
                reqRes.setMessage("Personnel mis à jour avec succès");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("Personnel non trouvé");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Erreur : " + e.getMessage());
        }
        return reqRes;
    }

    public ReqRes getMyInfo(String email) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<Personnel> personnelOptional = personnelRepo.findByEmail(email);
            if (personnelOptional.isPresent()) {
                reqRes.setPersonnel(personnelOptional.get());
                reqRes.setStatusCode(200);
                reqRes.setMessage("Succès");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("Personnel non trouvé");
            }

        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Erreur : " + e.getMessage());
        }
        return reqRes;
    }
}