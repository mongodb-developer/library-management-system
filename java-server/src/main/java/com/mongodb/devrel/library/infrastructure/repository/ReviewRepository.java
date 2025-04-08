package com.mongodb.devrel.library.infrastructure.repository;

import com.mongodb.devrel.library.domain.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
}
