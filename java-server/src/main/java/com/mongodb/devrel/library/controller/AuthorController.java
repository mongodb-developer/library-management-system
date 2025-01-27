package com.mongodb.devrel.library.controller;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mongodb.devrel.library.model.Author;
import com.mongodb.devrel.library.service.AuthorService;

@RestController
@RequestMapping("/author")
public class AuthorController {
     @Autowired
    private AuthorService authorService;

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Author>> getAuthorById(@PathVariable ObjectId id) {
        Optional<Author> author = authorService.authorById(id);

        return new ResponseEntity<Optional<Author>>(author, HttpStatus.OK);
    }
}
