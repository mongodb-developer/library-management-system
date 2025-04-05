package com.mongodb.devrel.library.domain.service;/*
 * Copyright (c) 2025 MongoDB, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *
 * Contributors:
 * - Ricardo Mello
 */

import com.mongodb.devrel.library.domain.model.User;
import com.mongodb.devrel.library.infrastructure.config.JWTConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class TokenService {

    private final JWTConfig jwtConfig;

    TokenService(JWTConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
    }

    public User extractUserFromHeader(String authorizationHeader) {
        String token = null;

        if (authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
        }

        User user = jwtConfig.toUser(token);

        log.debug("Token: {}", token);
        log.debug("Name: {}", user.getName());

        return user;
    }
}
