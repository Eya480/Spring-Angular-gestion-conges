package com.gestionConges.backend.gestionConges.config;

import com.gestionConges.backend.gestionConges.service.JWTUtils;
import com.gestionConges.backend.gestionConges.service.PersonnelDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.logging.Logger;

@Component
public class JWTAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private PersonnelDetailsService personnelDetailsService;

    private final Logger logger = Logger.getLogger(JWTAuthFilter.class.getName());

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        final String requestURI = request.getRequestURI();

        // Skip JWT authentication for the registration endpoint
        if (requestURI.startsWith("/auth/register") || requestURI.startsWith("/auth") || requestURI.startsWith("/api/departements/get-all")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        final String jwtToken;
        final String userEmail;

        // Vérifier la présence et le format de l'en-tête Authorization
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warning("Authorization header is missing or invalid.");
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authorization header is missing or invalid.");
            return;
        }

        try {
            jwtToken = authHeader.substring(7);
            logger.info("Extracted JWT Token for user.");

            userEmail = jwtUtils.extractUsername(jwtToken);
            logger.info("Extracted User Email: " + userEmail);
        } catch (Exception e) {
            logger.warning("Failed to parse JWT token: " + e.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token format.");
            return;
        }

        // Vérifier si l'utilisateur est déjà authentifié
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
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token.");
                    return;
                }
            } catch (Exception e) {
                logger.warning("User authentication failed: " + e.getMessage());
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication failed.");
                return;
            }
        }

        // Passer la requête au filtre suivant dans la chaîne
        filterChain.doFilter(request, response);
    }
}