package com.mongodb.devrel.library.application.web.controller;

import com.mongodb.devrel.library.application.web.controller.response.BorrowedBookResponse;
import com.mongodb.devrel.library.domain.model.IssueDetail;
import com.mongodb.devrel.library.domain.model.User;
import com.mongodb.devrel.library.domain.service.IssueDetailsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import static com.mongodb.devrel.library.application.web.controller.util.Constants.BOOK_RETURNED_SUCCESSFULLY;

@RestController
@RequestMapping("/borrow")
@Slf4j
public class BorrowsController extends BaseController{

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