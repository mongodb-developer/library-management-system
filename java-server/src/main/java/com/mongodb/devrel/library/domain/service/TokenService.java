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
import com.mongodb.devrel.library.domain.util.LoggedInUser;
import com.mongodb.devrel.library.infrastructure.config.JWTConfig;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class TokenService {

    private final JWTConfig jwtConfig;
    private final UserService userService;

    TokenService(JWTConfig jwtConfig, UserService userService) {
        this.jwtConfig = jwtConfig;
        this.userService = userService;
    }

    public User extractUserFromHeader(String authorizationHeader) {
        String token = null;

        if (authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
        }

        Claims claims = jwtConfig.extractClaimsFromJwt(token);

        User user = new User(
                new ObjectId(claims.get("sub", String.class)),
                claims.get("name", String.class),
                claims.get("isAdmin", Boolean.class)
        );

        log.debug("Token: {}", token);
        log.debug("Name: {}", user.getName());

        return user;
    }

    public String loginUser(Optional<String> username) {
        User user = userService.loginUser(username.orElse(""));
        log.info("User logged in: {}", user);
        LoggedInUser.user = user;
        return jwtConfig.fromUser(user);
    }


}
