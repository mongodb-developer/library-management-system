package com.mongodb.devrel.library.application.web.controller;

import java.util.Optional;

import com.mongodb.devrel.library.domain.model.User;
import com.mongodb.devrel.library.domain.service.UserService;
import com.mongodb.devrel.library.domain.util.LoggedInUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mongodb.devrel.library.domain.util.JWT;

import lombok.Data;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

     @GetMapping("/login")
    public ResponseEntity<JWTResponse> login(@RequestParam Optional<String> userName) {
        User user = userService.loginUser(userName.orElse(""));

        LoggedInUser.user = user;

        String jwt = JWT.fromUser(user);
        JWTResponse response = new JWTResponse();
        response.jwt = jwt;

        return new ResponseEntity<JWTResponse>(response, HttpStatus.OK);
    }

    @Data
    private class JWTResponse {
        String jwt;
    }

}