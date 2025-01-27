package com.mongodb.devrel.library.service;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mongodb.devrel.library.model.Author;
import com.mongodb.devrel.library.repository.AuthorRepository;

import java.util.Optional;

@Service
public class AuthorService {
    @Autowired
    private AuthorRepository authorRepository;

    public Optional<Author> authorById(ObjectId id) {
        System.out.println(id);
        return authorRepository.findAuthorById(id);
    }
}