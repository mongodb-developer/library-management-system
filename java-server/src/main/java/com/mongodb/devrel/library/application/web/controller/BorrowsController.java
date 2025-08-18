package com.mongodb.devrel.library.application.web.controller;

import com.mongodb.devrel.library.application.web.controller.response.BorrowedBookResponse;
import com.mongodb.devrel.library.domain.model.IssueDetail;
import com.mongodb.devrel.library.domain.model.User;
import com.mongodb.devrel.library.domain.service.IssueDetailsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

import static com.mongodb.devrel.library.application.web.controller.util.Constants.*;

@RestController
@RequestMapping("/borrow")

public class BorrowsController extends BaseController{

    private static final Logger log = LoggerFactory.getLogger(BorrowsController.class);

    private final IssueDetailsService issueDetailsService;

    BorrowsController(
            IssueDetailsService issueDetailsService) {
        this.issueDetailsService = issueDetailsService;
    }

    @GetMapping
    public ResponseEntity<List<IssueDetail>> getBorrowedBooksForCurrentUser(@ModelAttribute("loggedInUser") User loggedInUser) {
        return ResponseEntity.ok(issueDetailsService.findAllBorrowedBooksForCurrentUser(loggedInUser));
    }

     @GetMapping("/page")
     public ResponseEntity<BorrowedBookResponse> getPageOfBorrowedBooks(@ModelAttribute("loggedInUser") User loggedInUser, @RequestParam Optional<Integer> limit, @RequestParam Optional<Integer> skip) {
        if (!loggedInUser.isAdmin()) {
            return ResponseEntity.status(403).build();
        }

        Integer theLimit = limit.orElse(10);
        Integer theSkip = skip.orElse(0);
        Page<IssueDetail> books = issueDetailsService.findAllBorrowedBooks(theLimit, theSkip);
        return ResponseEntity.ok(new BorrowedBookResponse(books.getContent()));
     }

     @PostMapping("{bookId}/{userId}")
     @ResponseStatus(HttpStatus.NO_CONTENT)
     void lendBookToUser(@PathVariable String bookId, @PathVariable String userId) {
         issueDetailsService.lendBookToUser(bookId, userId);
         log.info("Book {} lend to userId {}", bookId, userId);
     }

     @PostMapping("{bookId}/{userId}/return")
     @ResponseStatus(HttpStatus.NO_CONTENT)
     public ResponseEntity<String> returnBook(@PathVariable String bookId, @PathVariable String userId) {
         issueDetailsService.userReturnsBook(bookId, userId);
         return ResponseEntity.ok(BOOK_RETURNED_SUCCESSFULLY);
     }
}