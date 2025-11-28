package com.mongodb.devrel.library.application.web.controller;


import com.mongodb.devrel.library.application.web.controller.request.ReviewRequest;
import com.mongodb.devrel.library.application.web.controller.util.SearchType;
import com.mongodb.devrel.library.domain.model.Book;
import com.mongodb.devrel.library.domain.model.Review;
import com.mongodb.devrel.library.domain.model.User;
import com.mongodb.devrel.library.domain.service.BookService;
import com.mongodb.devrel.library.domain.service.ReviewService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

import static com.mongodb.devrel.library.application.web.controller.util.Constants.*;

@RestController
@RequestMapping("/books")
public class BookController extends BaseController{

    private final BookService bookService;
    private final ReviewService reviewService;

    BookController(BookService bookService, ReviewService reviewService) {
        this.bookService = bookService;
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks(
            @RequestParam Optional<Integer> limit,
            @RequestParam Optional<Integer> page) {

        Integer size = limit.orElse(DEFAULT_PAGE_SIZE);
        Integer pageNumber = page.orElse(DEFAULT_PAGE_NUMBER);
        Page<Book> books = bookService.findAllBooks(size, pageNumber);

        return new ResponseEntity<>(books.getContent(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Book>> getBook(@PathVariable String id) {
        return new ResponseEntity<>(bookService.getBook(id), HttpStatus.OK);
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<Review> createBookReview(@ModelAttribute("loggedInUser") User loggedInUser, @PathVariable String id, @RequestBody ReviewRequest reviewRequest, @RequestHeader("Authorization") String authorizationHeader) {
        return new ResponseEntity<>(reviewService.createReview(id, reviewRequest, loggedInUser), HttpStatus.CREATED);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Book>> searchBooks(
            @RequestParam Optional<String> term,
            @RequestParam Optional<String> searchType) {
        String theTerm = term.orElse("");

        SearchType type = searchType
                .map(s -> {
                    try {
                        return SearchType.valueOf(s.trim().toUpperCase());
                    } catch (IllegalArgumentException e) {
                        return SearchType.KEYWORD;
                    }
                }).orElse(SearchType.KEYWORD);

        return new ResponseEntity<>(
                bookService.searchBooks(theTerm, type),
                HttpStatus.OK
        );
    }

}
