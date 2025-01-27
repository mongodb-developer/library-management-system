package com.mongodb.devrel.library.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.mongodb.devrel.library.model.User;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    // we need to return our book.id as book._id per the JavaScript client and to be
    // on par with the Node server
    Optional<User> findUserBy_id(String id);

    Optional<User> findUserByName(String name);
}
