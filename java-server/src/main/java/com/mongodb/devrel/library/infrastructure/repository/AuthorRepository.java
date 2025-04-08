package com.mongodb.devrel.library.infrastructure.repository;

import com.mongodb.devrel.library.domain.model.Author;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthorRepository extends MongoRepository<Author, String> {
    Optional<Author> findAuthorById(String authorId);
}



