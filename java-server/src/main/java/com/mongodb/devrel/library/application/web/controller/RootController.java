package com.mongodb.devrel.library.application.web.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class RootController {
    
    @GetMapping
    public String getRoot() {
        return "OK Boomer";
    }
}