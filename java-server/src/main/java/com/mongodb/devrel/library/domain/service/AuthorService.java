package com.mongodb.devrel.library.domain.service;

import com.mongodb.devrel.library.domain.model.Author;
import com.mongodb.devrel.library.infrastructure.repository.AuthorRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;


import java.util.Optional;

@Service
public class AuthorService {

    private final AuthorRepository authorRepository;

    AuthorService(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    public Optional<Author> authorById(ObjectId id) {
        System.out.println(id);
        return authorRepository.findAuthorById(id);
    }
}