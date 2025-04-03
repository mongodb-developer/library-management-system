package com.mongodb.devrel.library.application.web.controller;

import java.util.List;
import java.util.Optional;

import com.mongodb.devrel.library.domain.model.Book;
import com.mongodb.devrel.library.domain.model.IssueDetail;
import com.mongodb.devrel.library.domain.model.User;
import com.mongodb.devrel.library.domain.service.BookService;
import com.mongodb.devrel.library.domain.service.IssueDetailsService;
import com.mongodb.devrel.library.resources.config.JWTConfig;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

/**
 * Routes
 *
 * GET /reservations/page: Returns a page of reservations.
 * GET /reservations: Returns the list of reservations for the logged in user
 * GET /reservations/:reservationId: Returns the details of a reservation.
 * POST /reservations/:bookId: Creates a new reservation.
 * DELETE /reservations/:bookId: Deletes a reservation.
 * GET /reservations/user/:userId: Returns the list of reservations for the
 * specified user.
 *
 */

@Slf4j
@RestController
@RequestMapping("/reservations")
public class ReservationsController {

    private final IssueDetailsService issueDetailsService;
    private final BookService bookService;
    private final JWTConfig jwtConfig;

    ReservationsController(BookService bookService, IssueDetailsService issueDetailsService, JWTConfig jwtConfig) {
        this.bookService = bookService;
        this.issueDetailsService = issueDetailsService;
        this.jwtConfig = jwtConfig;

    }

    @GetMapping
    public List<IssueDetail> getReservedBooksForCurrentUser(@RequestHeader("Authorization") String authorizationHeader) {

        User loggedInUser = jwtConfig.loggedInUserFromBearerAuthenticationHeader(authorizationHeader);

        List<IssueDetail> books = issueDetailsService.findAllReservedBooksForCurrentUser(loggedInUser);

        return books;
    }


    @Data
    @AllArgsConstructor
    private class ReservedBooksResponse {
        List<IssueDetail> data;
    }


    /**
     * Gets a Page of Reserved Books in the Admin interface
     * @param authorizationHeader
     * @param limit
     * @param skip
     * @return
     */
    @GetMapping("/page")
    public ReservedBooksResponse getPageOfReservedBooks(@RequestHeader("Authorization") String authorizationHeader, @RequestParam Optional<Integer> limit, @RequestParam Optional<Integer> skip) {
        
        User loggedInUser = jwtConfig.loggedInUserFromBearerAuthenticationHeader(authorizationHeader);

        if (!loggedInUser.isAdmin()) {
            return null;
        }

        Integer theLimit = limit.orElse(10);
        Integer theSkip = skip.orElse(0);
        Page<IssueDetail> books = issueDetailsService.findAllReservedBooks(theLimit, theSkip);

        return new ReservedBooksResponse(books.getContent());
    }

    @Data
    @AllArgsConstructor
    private class ReservationResponse {
        String message;
        String insertedId;
    }

    @PostMapping("/{bookId}")
    public ReservationResponse reserveBook(@RequestHeader("Authorization") String authorizationHeader, @PathVariable String bookId) {
        User loggedInUser = jwtConfig.loggedInUserFromBearerAuthenticationHeader(authorizationHeader);

        Optional<Book> book = bookService.bookById(bookId);

        ReservationResponse response = null;
        if (book.isPresent()) {
            IssueDetail reservedBook = issueDetailsService.reserveBookForUser(book.get(), loggedInUser);
            response = new ReservationResponse("Reservation created", reservedBook.get_id());
        }

        return response;
    }

    @Data
    private class CancelReservationResponse {
        String message = "Reservation cancelled";
    }

    @DeleteMapping("/{reservationId}")
    public CancelReservationResponse cancelReservation(@RequestHeader("Authorization") String authorizationHeader, @PathVariable String reservationId) {
        User loggedInUser = jwtConfig.loggedInUserFromBearerAuthenticationHeader(authorizationHeader);

        issueDetailsService.cancelReservation(reservationId, loggedInUser.get_id());;
        CancelReservationResponse response  = new CancelReservationResponse();

        return response;
    }
}