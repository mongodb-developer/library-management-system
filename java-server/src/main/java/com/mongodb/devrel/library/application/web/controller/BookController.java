package com.mongodb.devrel.library.application.web.controller;


import com.mongodb.devrel.library.application.web.controller.request.ReviewRequest;
import com.mongodb.devrel.library.domain.model.Book;
import com.mongodb.devrel.library.domain.model.Review;
import com.mongodb.devrel.library.domain.model.User;
import com.mongodb.devrel.library.domain.service.BookService;
import com.mongodb.devrel.library.domain.service.ReviewService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/books")
public class BookController {

    private final BookService bookService;
    private final ReviewService reviewService;

    BookController(BookService bookService, ReviewService reviewService) {
        this.bookService = bookService;
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks(@RequestParam Optional<Integer> limit, @RequestParam Optional<Integer> skip) {

        Integer theLimit = limit.orElse(10);
        Integer theSkip = skip.orElse(0);
        Page<Book> books = bookService.findAllBooks(theLimit, theSkip);

        return new ResponseEntity<>(books.getContent(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Book>> getBook(@PathVariable String id) {
        return new ResponseEntity<>(bookService.bookById(id), HttpStatus.OK);
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<Review> createBookReview(HttpServletRequest request,  @PathVariable String id, @RequestBody ReviewRequest reviewRequest, @RequestHeader("Authorization") String authorizationHeader) {
        User loggedInUser = (User) request.getAttribute("loggedInUser");

        return new ResponseEntity<>(reviewService.createReview(id, reviewRequest, loggedInUser), HttpStatus.CREATED);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Book>> searchBooks(@RequestParam Optional<String> term) {

        String theTerm = term.orElse("");
        Page<Book> books = bookService.searchBooks(theTerm);

        return new ResponseEntity<>(books.getContent(), HttpStatus.OK);
    }

}
