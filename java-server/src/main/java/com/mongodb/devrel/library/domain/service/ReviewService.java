package com.mongodb.devrel.library.domain.service;

import com.mongodb.devrel.library.application.web.controller.request.ReviewRequest;
import com.mongodb.devrel.library.domain.model.Book;
import com.mongodb.devrel.library.domain.model.Review;
import com.mongodb.devrel.library.domain.model.User;
import com.mongodb.devrel.library.infrastructure.repository.ReviewRepository;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final MongoOperations mongoOperation;

    ReviewService(ReviewRepository reviewRepository, MongoOperations mongoOperation) {
        this.reviewRepository = reviewRepository;
        this.mongoOperation = mongoOperation;
    }

    public List<Review> allReviews() {
        return reviewRepository.findAll();
    }

     public Review createReview(String bookId, ReviewRequest reviewRequest, User loggedInUser) {
         Review review = new Review(null, reviewRequest.text(), reviewRequest.rating(), loggedInUser.name(), new Date(), bookId);

         reviewRepository.insert(review);

         Document pushOperation = new Document("$each", List.of(review))
                 .append("$sort", new Document("timestamp", -1))
                 .append("$slice", 5);

         mongoOperation.update(Book.class)
                 .matching(Criteria.where("_id").is(bookId))
                 .apply(new Update().push("reviews", pushOperation))
                 .first();


         return review;
     }
}
