package com.mongodb.devrel.library.application.web.controller;

import com.mongodb.devrel.library.domain.model.Review;
import com.mongodb.devrel.library.domain.service.ReviewService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
public class ReviewController {

    private static final Logger log = LoggerFactory.getLogger(ReviewController.class);

    private final ReviewService reviewService;

    ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<List<Review>> allReviews() {
        log.info("Retrieving all reviews ..");
        return new ResponseEntity<>(reviewService.allReviews(), HttpStatus.OK);
    }

}
