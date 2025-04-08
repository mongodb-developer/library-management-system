package com.mongodb.devrel.library.application.web.controller;

import com.mongodb.devrel.library.application.web.controller.response.JWTResponse;
import com.mongodb.devrel.library.domain.service.TokenService;
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


    private final TokenService tokenService;

    UserController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @GetMapping("/login")
    public ResponseEntity<JWTResponse> login(@RequestParam Optional<String> userName) {
        return new ResponseEntity<>(new JWTResponse(tokenService.loginUser(userName)), HttpStatus.OK);
    }

}