package com.mongodb.devrel.library.infrastructure.config;

import com.mongodb.devrel.library.domain.model.User;
import com.mongodb.devrel.library.domain.service.TokenJWTService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class AuthHeaderUserSetupFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(AuthHeaderUserSetupFilter.class);
    private final TokenJWTService tokenJWTService;

    public AuthHeaderUserSetupFilter(TokenJWTService tokenJWTService) {
        this.tokenJWTService = tokenJWTService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String authorizationHeader = request.getHeader("Authorization");
        if (StringUtils.hasText(authorizationHeader) && authorizationHeader.startsWith("Bearer ")) {
            User loggedInUser = tokenJWTService.extractUserFromHeader(authorizationHeader);
            request.setAttribute("loggedInUser", loggedInUser);

            log.debug("Name: {}", loggedInUser.name());
        }

        chain.doFilter(request, response);
    }
}