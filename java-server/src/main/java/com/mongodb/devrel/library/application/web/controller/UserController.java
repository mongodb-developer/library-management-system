package com.mongodb.devrel.library.application.web.controller;

import com.mongodb.devrel.library.application.web.controller.response.JWTResponse;
import com.mongodb.devrel.library.domain.service.TokenJWTService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {


    private final TokenJWTService tokenJWTService;

    UserController(TokenJWTService tokenJWTService) {
        this.tokenJWTService = tokenJWTService;
    }

    @GetMapping("/login")
    public ResponseEntity<JWTResponse> login(@RequestParam Optional<String> userName) {
        return new ResponseEntity<>(new JWTResponse(tokenJWTService.loginUser(userName)), HttpStatus.OK);
    }

}