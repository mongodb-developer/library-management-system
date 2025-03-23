package com.mongodb.devrel.library.application.web.controller;

import com.mongodb.devrel.library.domain.model.Review;
import com.mongodb.devrel.library.domain.service.ReviewService;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/reviews")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<Review>> allReviews() {
        return new ResponseEntity<List<Review>>(reviewService.allReviews(), HttpStatus.OK);
    }

    // @PostMapping
    // public ResponseEntity<Review> createReview(@RequestBody Map<String, String> payload) {
    //     return new ResponseEntity<Review>(reviewService.createReview(payload.get("reviewBody"), payload.get("imdbId")), HttpStatus.CREATED);
    // }
}
