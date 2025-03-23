package com.mongodb.devrel.library.resources.repository;

import com.mongodb.devrel.library.domain.model.Author;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthorRepository extends MongoRepository<Author, ObjectId> {
    Optional<Author> findAuthorById(ObjectId authorId);    
}
