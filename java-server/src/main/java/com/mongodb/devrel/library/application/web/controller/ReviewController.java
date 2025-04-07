package com.mongodb.devrel.library.application.web.controller;

import com.mongodb.devrel.library.domain.model.Review;
import com.mongodb.devrel.library.domain.service.ReviewService;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<List<Review>> allReviews() {
        return new ResponseEntity<>(reviewService.allReviews(), HttpStatus.OK);
    }

}
