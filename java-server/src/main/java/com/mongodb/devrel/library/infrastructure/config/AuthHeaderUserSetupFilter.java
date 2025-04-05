package com.mongodb.devrel.library.infrastructure.config;/*
 * Copyright (c) 2025 MongoDB, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *
 *     http://www.apache.org/licenses/LICENSE-2.0 *
 *
 * Contributors:
 * - ricardomello
 */

import com.mongodb.devrel.library.domain.model.User;
import com.mongodb.devrel.library.domain.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
public class AuthHeaderUserSetupFilter extends OncePerRequestFilter {

    private final TokenService tokenService;

    public AuthHeaderUserSetupFilter(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String authorizationHeader = request.getHeader("Authorization");
        if (StringUtils.hasText(authorizationHeader) && authorizationHeader.startsWith("Bearer ")) {
            User loggedInUser = tokenService.extractUserFromHeader(authorizationHeader);
            request.setAttribute("loggedInUser", loggedInUser);

            log.debug("Name: {}", loggedInUser.getName());
        }

        chain.doFilter(request, response);
    }
}