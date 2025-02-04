package com.gestionConges.backend.gestionConges.config;

import com.gestionConges.backend.gestionConges.service.PersonnelDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


//Configurez Spring Security pour utiliser le filtre JWT
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Autowired
    private PersonnelDetailsService personnelDetailsService;
    @Autowired
    private JWTAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(request -> request
                        .requestMatchers("/auth/**","/api/departements/get-all").permitAll()
                        .requestMatchers("/api/demande-conges/**").hasAnyAuthority("User")
                        .requestMatchers("/api/typeConges/get-all").hasAnyAuthority("Manager","User","AdminRH")
                        .requestMatchers("/api/typeConges/**").hasAnyAuthority("AdminRH")
                        .requestMatchers("/api/departements/**").hasAnyAuthority("Admin")
                        .requestMatchers("/api/adminRH/**").hasAnyAuthority("Admin")
                        .requestMatchers("/api/Manager/**").hasAnyAuthority("Manager")
                        .requestMatchers("/api/employees/**").hasAnyAuthority("AdminRH")
                        .requestMatchers("/UserManager/**").hasAnyAuthority("Manager","User")
                        .requestMatchers("/adminRHUserManagerAdmin/**").hasAnyAuthority("AdminRH", "Manager", "User","Admin")
                        .requestMatchers("/api/adminAdminRH").hasAnyAuthority("Admin","AdminRH")
                        .anyRequest().authenticated())
                .sessionManagement(manager -> manager.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
                 return httpSecurity.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(personnelDetailsService);
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
        return daoAuthenticationProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}