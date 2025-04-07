package com.mongodb.devrel.library.application.web.controller;

import java.util.List;
import java.util.Optional;

import com.mongodb.devrel.library.domain.model.Book;
import com.mongodb.devrel.library.domain.model.IssueDetail;
import com.mongodb.devrel.library.domain.model.User;
import com.mongodb.devrel.library.domain.service.BookService;
import com.mongodb.devrel.library.domain.service.IssueDetailsService;
import jakarta.servlet.http.HttpServletRequest;
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

@Slf4j
@RestController
@RequestMapping("/reservations")
public class ReservationsController {

    private final IssueDetailsService issueDetailsService;
    private final BookService bookService;

    ReservationsController(BookService bookService, IssueDetailsService issueDetailsService) {
        this.bookService = bookService;
        this.issueDetailsService = issueDetailsService;
    }

    @GetMapping
    public List<IssueDetail> getReservedBooksForCurrentUser(HttpServletRequest request, @RequestHeader("Authorization") String authorizationHeader) {
        User loggedInUser = (User) request.getAttribute("loggedInUser");

        return issueDetailsService.findAllReservedBooksForCurrentUser(loggedInUser);
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
    public ReservedBooksResponse getPageOfReservedBooks(HttpServletRequest request, @RequestHeader("Authorization") String authorizationHeader, @RequestParam Optional<Integer> limit, @RequestParam Optional<Integer> skip) {

        User loggedInUser = (User) request.getAttribute("loggedInUser");

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
    public ReservationResponse reserveBook(HttpServletRequest request, @PathVariable String bookId) {
        User loggedInUser = (User) request.getAttribute("loggedInUser");

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
    public CancelReservationResponse cancelReservation(HttpServletRequest request, @RequestHeader("Authorization") String authorizationHeader, @PathVariable String reservationId) {
        User loggedInUser = (User) request.getAttribute("loggedInUser");

        issueDetailsService.cancelReservation(reservationId, loggedInUser.get_id());;
        CancelReservationResponse response  = new CancelReservationResponse();

        return response;
    }
}