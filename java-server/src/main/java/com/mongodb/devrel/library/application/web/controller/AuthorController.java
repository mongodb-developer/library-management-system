package com.mongodb.devrel.library.application.web.controller;

 import com.mongodb.devrel.library.domain.model.Author;
import com.mongodb.devrel.library.domain.service.AuthorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;


@RestController
@RequestMapping("/authors")
public class AuthorController {

    private final AuthorService authorService;

     AuthorController(AuthorService authorService) {
         this.authorService = authorService;
     }

    @GetMapping("/{authorId}")
    public ResponseEntity<Optional<Author>> getAuthorById(@PathVariable String authorId) {
        Optional<Author> author = authorService.authorById(authorId);

        return new ResponseEntity<>(author, HttpStatus.OK);
    }
}
