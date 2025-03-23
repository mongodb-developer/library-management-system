package com.mongodb.devrel.library.domain.service;

 import com.mongodb.devrel.library.domain.model.Review;
 import com.mongodb.devrel.library.resources.repository.ReviewRepository;
 import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    // @Autowired
    // private MongoTemplate mongoTemplate;

    public List<Review> allReviews() {
        return reviewRepository.findAll();
    }

    // public Review createReview(String reviewBody, String imdbId) {
    //     Review review = new Review(reviewBody);

    //     reviewRepository.insert(review);

    //     mongoTemplate
    //         .update(Book.class)
    //         .matching(Criteria.where("imdbId").is(imdbId))
    //         .apply(new Update().push("reviewIds").value(review))
    //             .first();

    //     return review;
    // }
}
