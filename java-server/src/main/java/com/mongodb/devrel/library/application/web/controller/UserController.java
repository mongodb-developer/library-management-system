package com.mongodb.devrel.library.application.web.controller;

import java.util.Optional;

import com.mongodb.devrel.library.domain.model.User;
import com.mongodb.devrel.library.domain.service.UserService;
import com.mongodb.devrel.library.infrastructure.config.JWTConfig;
import com.mongodb.devrel.library.domain.util.LoggedInUser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.Data;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final JWTConfig jwtConfig;

    UserController(UserService userService, JWTConfig jwtConfig) {
        this.userService = userService;
        this.jwtConfig = jwtConfig;
    }

    @GetMapping("/login")
    public ResponseEntity<JWTResponse> login(@RequestParam Optional<String> userName) {
        User user = userService.loginUser(userName.orElse(""));

        LoggedInUser.user = user;

        String result = jwtConfig.fromUser(user);
        JWTResponse response = new JWTResponse();
        response.jwt = result;

        return new ResponseEntity<JWTResponse>(response, HttpStatus.OK);
    }

    @Data
    private class JWTResponse {
        String jwt;
    }

}