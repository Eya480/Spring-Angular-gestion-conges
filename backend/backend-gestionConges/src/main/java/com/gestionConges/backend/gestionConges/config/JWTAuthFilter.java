package com.gestionConges.backend.gestionConges.config;

import com.gestionConges.backend.gestionConges.service.JWTUtils;
import com.gestionConges.backend.gestionConges.service.PersonnelDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.logging.Logger;

//Créez un filtre pour intercepter les requêtes et valider les JWT dans l'en-tête Authorization
@Component
public class JWTAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private PersonnelDetailsService personnelDetailsService;

    private final Logger logger = Logger.getLogger(JWTAuthFilter.class.getName());

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwtToken;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ") || authHeader.trim().isEmpty()) {
            logger.info("Authorization header is missing or invalid.");
            filterChain.doFilter(request, response);
            return;
        }

        try {
            jwtToken = authHeader.substring(7);
            logger.info("Extracted JWT Token: " + jwtToken);

            userEmail = jwtUtils.extractUsername(jwtToken);
            logger.info("Extracted User Email: " + userEmail);
        } catch (Exception e) {
            logger.warning("Failed to parse JWT token: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid token format.");
            return;
        }

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = personnelDetailsService.loadUserByUsername(userEmail);

                if (jwtUtils.isTokenValid(jwtToken, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    logger.info("User authenticated successfully: " + userDetails.getUsername());
                } else {
                    logger.warning("Invalid JWT Token.");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Invalid or expired token.");
                    return;
                }
            } catch (Exception e) {
                logger.warning("User authentication failed: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Authentication failed.");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
