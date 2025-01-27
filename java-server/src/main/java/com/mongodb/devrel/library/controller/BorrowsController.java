package com.mongodb.devrel.library.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mongodb.devrel.library.model.IssueDetail;
import com.mongodb.devrel.library.model.User;
import com.mongodb.devrel.library.service.IssueDetailsService;
import com.mongodb.devrel.library.util.JWT;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Routes
 *
 * GET /borrow/page: Returns a page of borrowed books
 * POST /borrow/:bookId/:userId: Creates a new borrowed book for a user
 * GET /borrow: Returns all borrowed books for the logged in user
 * POST /borrow/:bookId/:userId/return: Returns a borrowed book
 * GET /borrow/history: Returns the history of borrowed books for the logged in
 * user
 *
 */


@RestController
@RequestMapping("/borrow")
public class BorrowsController {
    @Autowired
    private IssueDetailsService issueDetailsService;

    @GetMapping
    public List<IssueDetail> getBorowedBooksForCurrentUser(@RequestHeader("Authorization") String authorizationHeader) {
        User loggedInUser = JWT.loggedInUserFromBearerAuthenticationHeader(authorizationHeader);
        
        List<IssueDetail> books = issueDetailsService.findAllBorrowedBooksForCurrentUser(loggedInUser);
        return books;
    }

    @Data
    @AllArgsConstructor
    private class BorrowedBooksResponse {
        List<IssueDetail> data;
    }

     @GetMapping("/page")
     public BorrowedBooksResponse getPageOfBorrowedBooks(@RequestHeader("Authorization") String authorizationHeader, @RequestParam Optional<Integer> limit, @RequestParam Optional<Integer> skip) {
         User loggedInUser = JWT.loggedInUserFromBearerAuthenticationHeader(authorizationHeader);

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