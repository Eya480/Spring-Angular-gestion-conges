package com.gestionConges.backend.gestionConges.service;

import com.gestionConges.backend.gestionConges.dto.ReqRes;
import com.gestionConges.backend.gestionConges.model.*;
import com.gestionConges.backend.gestionConges.repository.*;
import jakarta.transaction.Transactional;
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
    private ManagerRepo managerRepo;

    @Autowired
    private EmployeeRepo employeeRepo;

    @Autowired
    private AdminRHRepo adminRHRepo;

    @Autowired
    private AdminRepo adminRepo;

    @Autowired
    private DepartementRepo departementRepo;

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmployeService employeService;

    @Autowired
    private NotifRepo notifRepo;

    public ReqRes register(ReqRes registrationRequest) {
        ReqRes resp = new ReqRes();
        Personnel personnel = null;
        Departement departement = null;

        if (registrationRequest.getRole() != Role.Admin && registrationRequest.getRole() != Role.AdminRH) {
            if (registrationRequest.getDepartement() != null && registrationRequest.getDepartement().getNomDep() != null) {
                departement = departementRepo.findByNomDep(registrationRequest.getDepartement().getNomDep());
                if (departement == null) {
                    resp.setMessage("Département introuvable");
                    resp.setStatusCode(401);
                    return resp;
                }
            } else {
                resp.setMessage("Département non fourni ou nom du département invalide");
                resp.setStatusCode(400);
                return resp;
            }
        }

        if (personnelRepo.existsByEmail(registrationRequest.getEmail())) {
            resp.setStatusCode(400);
            resp.setMessage("Un utilisateur avec cet e-mail existe déjà.");
            return resp;
        }
        try {
            // Créer la sous-classe appropriée en fonction du rôle
            switch (registrationRequest.getRole()) {
                case Role.User:
                    Employe employe = new Employe();
                    employe.setDepartement(departement);
                    employe.setDateEmbauche(registrationRequest.getDateEmbauche());
                    employe.setsoldeCumule();
                    employe.setManager(departement.getManager());

                    AdminRH adminRHFixe = adminRHRepo.findFirstByOrderByIdAsc();
                    employe.setAdminRH(adminRHFixe);

                    employe.setPoste(registrationRequest.getPoste());
                    personnel = employe;
                    break;
                case Role.Manager:
                    Manager manager = new Manager();
                    manager.setDepartement(departement);
                    personnel = manager;
                    break;
                case Role.AdminRH:
                    if(adminRHRepo.findFirstByOrderByIdAsc()!=null){
                        resp.setStatusCode(400);
                        resp.setMessage("Il existe déja un Admin RH!");
                        return resp;
                    }
                    AdminRH adminRH = new AdminRH();
                    personnel = adminRH;
                    break;
                default:
                    resp.setStatusCode(400);
                    return resp;
            }

            // Définir les champs communs
            personnel.setCIN(registrationRequest.getCIN());
            personnel.setNom(registrationRequest.getNom());
            personnel.setPrenom(registrationRequest.getPrenom());
            personnel.setTel(registrationRequest.getTel());
            personnel.setEmail(registrationRequest.getEmail());
            personnel.setPwd(passwordEncoder.encode(registrationRequest.getPwd()));
            personnel.setRole(registrationRequest.getRole());

            // Enregistrer le personnel
            Personnel savedPersonnel = personnelRepo.save(personnel);
            resp.setPersonnel(savedPersonnel);
            resp.setMessage("Utilisateur enregistré avec succès");
            resp.setStatusCode(200);
        }catch (Exception e) {
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
            return resp;
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

    @Transactional
    public ReqRes deletePersonnel(Integer id) {
        ReqRes reqRes = new ReqRes();

        try {
                Personnel personnel=personnelRepo.findById(id).orElseThrow(()->new RuntimeException("personnel non trouvé"));
                if (personnel instanceof Admin) {
                    reqRes.setStatusCode(403);
                    reqRes.setMessage("Vous ne pouvez pas supprimer un Admin.");
                    return reqRes;
                }

                personnelRepo.delete(personnel);

                reqRes.setStatusCode(200);

                reqRes.setMessage("Personnel supprimé avec succès.");
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Erreur : " + e.getMessage());
        }

        return reqRes;
    }

    public void updateRole(Integer id, Role newRole, String nomDep) {
        Departement departement = departementRepo.findByNomDep(nomDep);
        Personnel personnel = personnelRepo.findById(id).orElse(null);

        if (personnel == null) {
            throw new IllegalArgumentException("Personnel not found");
        }

        // Vérifier si l'utilisateur est un User et doit devenir Manager
        if (personnel.getRole() == Role.User && newRole == Role.Manager) {
            if (departement.getManager() != null) {
                throw new IllegalStateException("Ce Département a déjà un Manager");
            } else {
                personnel.setRole(Role.Manager); // Changer directement le rôle

                // Caster en Manager et assigner le département
                Manager manager = (Manager) personnel;
                manager.setDepartement(departement);
                departement.setManager(manager); // Associer le manager au département

                personnelRepo.save(manager); // Mettre à jour en base
                departementRepo.save(departement);
            }
        }
    }




    public ReqRes updatePersonnel(Integer id, Personnel updatedPersonnel) {
        ReqRes reqRes = new ReqRes();

        try {
            Optional<Personnel> personnelOptional = personnelRepo.findById(id);

            if (personnelOptional.isEmpty()) {
                reqRes.setStatusCode(404);
                reqRes.setMessage("Personnel non trouvé");
                return reqRes;
            }

            Personnel existingPersonnel = personnelOptional.get();

            // Mise à jour des informations générales communes
            existingPersonnel.setEmail(updatedPersonnel.getEmail());
            existingPersonnel.setNom(updatedPersonnel.getNom());
            existingPersonnel.setPrenom(updatedPersonnel.getPrenom());
            existingPersonnel.setCIN(updatedPersonnel.getCIN());
            existingPersonnel.setTel(updatedPersonnel.getTel());
            existingPersonnel.setRole(updatedPersonnel.getRole());

            if (updatedPersonnel.getPwd() != null && !updatedPersonnel.getPwd().isEmpty()) {
                existingPersonnel.setPwd(passwordEncoder.encode(updatedPersonnel.getPwd()));
            }

            // Mise à jour des propriétés spécifiques en fonction du type d'instance
            if (existingPersonnel instanceof Employe employe) {
                if (updatedPersonnel instanceof Employe updatedEmploye) {
                    employe.setDepartement(departementRepo.findByNomDep(
                            updatedEmploye.getDepartement().getNomDep()));
                } else {
                    reqRes.setStatusCode(400);
                    reqRes.setMessage("Type de personnel incompatible : attendu Employe");
                    return reqRes;
                }
            } else if (existingPersonnel instanceof Manager manager) {
                if (updatedPersonnel instanceof Manager updatedManager) {
                    manager.setDepartement(departementRepo.findByNomDep(
                            updatedManager.getDepartement().getNomDep()));
                } else {
                    reqRes.setStatusCode(400);
                    reqRes.setMessage("Type de personnel incompatible : attendu Manager");
                    return reqRes;
                }
            }

            // Sauvegarde des modifications
            Personnel savedPersonnel = personnelRepo.save(existingPersonnel);
            reqRes.setPersonnel(savedPersonnel);
            reqRes.setStatusCode(200);
            reqRes.setMessage("Personnel mis à jour avec succès");

        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Erreur lors de la mise à jour : " + e.getMessage());
        }

        return reqRes;
    }

    public List<Notification> getAllNotifByPersonnel(String email){
        return notifRepo.getAllNotificationByDestinataire(personnelRepo.findByEmail(email).get());
    }



    public ReqRes getMyInfo(String email) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<Personnel> personnelOptional = personnelRepo.findByEmail(email);
            if (personnelOptional.isPresent()) {
                Personnel personnel = personnelOptional.get();
                //System.out.println("Classe de personnel: " + personnel.getClass().getName());

                if (personnel instanceof Employe) {
                    Employe employe = (Employe) personnel;  // Cast to the Employe class
                    reqRes.setEmploye(employe);
                }

                if(personnel.getRole()==Role.Manager){
                    Manager manager=(Manager) personnel;
                    reqRes.setManager(manager);
                }

                reqRes.setPersonnel(personnel);
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

    public List<Employe> getAllEmployees() {
        return personnelRepo.findAllEmployees();
    }

    public Personnel getPersonnelById(Integer id){
        return personnelRepo.findById(id).orElse(null);
    }


}