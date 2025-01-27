package com.mongodb.devrel.library.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.mongodb.devrel.library.model.Review;

@Repository
public interface ReviewRepository extends MongoRepository<Review, ObjectId> {
}
