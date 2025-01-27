package com.mongodb.devrel.library.repository;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.mongodb.devrel.library.model.Author;

@Repository
public interface AuthorRepository extends MongoRepository<Author, ObjectId> {
    Optional<Author> findAuthorById(ObjectId authorId);    
}
