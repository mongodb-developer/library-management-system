package com.mongodb.devrel.library.application.web.controller;

import com.mongodb.devrel.library.domain.model.IssueDetail;
import com.mongodb.devrel.library.domain.model.User;
import com.mongodb.devrel.library.domain.service.IssueDetailsService;
import com.mongodb.devrel.library.domain.service.TokenService;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/borrow")
public class BorrowsController {

    private final IssueDetailsService issueDetailsService;
    private final TokenService tokenService;

    BorrowsController(
            IssueDetailsService issueDetailsService,
            TokenService tokenService) {
        this.issueDetailsService = issueDetailsService;
        this.tokenService = tokenService;
    }

    @GetMapping
    public List<IssueDetail> getBorrowedBooksForCurrentUser(@RequestHeader("Authorization") String authorizationHeader) {
        User loggedInUser = tokenService.extractUserFromHeader(authorizationHeader);

        return issueDetailsService.findAllBorrowedBooksForCurrentUser(loggedInUser);
    }

    @Data
    @AllArgsConstructor
    private static class BorrowedBooksResponse {
        List<IssueDetail> data;
    }

     @GetMapping("/page")
     public BorrowedBooksResponse getPageOfBorrowedBooks(@RequestHeader("Authorization") String authorizationHeader, @RequestParam Optional<Integer> limit, @RequestParam Optional<Integer> skip) {
         User loggedInUser = tokenService.extractUserFromHeader(authorizationHeader);

         // only admins can see all borrowed books
        if (!loggedInUser.isAdmin()) {
            return null;
        }

        Integer theLimit = limit.orElse(10);
        Integer theSkip = skip.orElse(0);
        Page<IssueDetail> books = issueDetailsService.findAllBorrowedBooks(theLimit, theSkip);
        return new BorrowedBooksResponse(books.getContent());
     }

     @PostMapping("{bookId}/{userId}")
     void lendBookToUser(@PathVariable String bookId, @PathVariable String userId) {
        issueDetailsService.lendBookTouser(bookId, userId);
     }

     @PostMapping("{bookId}/{userId}/return")
     String returnBook(@PathVariable String bookId, @PathVariable String userId) {
         Integer updated = issueDetailsService.userReturnsBook(bookId, userId);

         return "{\n" + //
                          "    \"acknowledged\": true,\n" + //
                          "    \"modifiedCount\": 1,\n" + //
                          "    \"upsertedId\": null,\n" + //
                          "    \"upsertedCount\": 0,\n" + //
                          "    \"matchedCount\": 1\n" + //
                          "}";
     }
}