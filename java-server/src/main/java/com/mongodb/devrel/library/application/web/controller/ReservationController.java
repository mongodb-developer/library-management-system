package com.mongodb.devrel.library.application.web.controller;

import com.mongodb.devrel.library.application.web.controller.response.ReservationResponse;
import com.mongodb.devrel.library.application.web.controller.response.ReservedBooksResponse;
import com.mongodb.devrel.library.domain.model.IssueDetail;
import com.mongodb.devrel.library.domain.model.User;
import com.mongodb.devrel.library.domain.service.BookService;
import com.mongodb.devrel.library.domain.service.IssueDetailsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import static com.mongodb.devrel.library.application.web.controller.util.Constants.*;

@Slf4j
@RestController
@RequestMapping("/reservations")
public class ReservationController extends BaseController{

    private final IssueDetailsService issueDetailsService;
    private final BookService bookService;

    ReservationController(BookService bookService, IssueDetailsService issueDetailsService) {
        this.bookService = bookService;
        this.issueDetailsService = issueDetailsService;
    }

    @GetMapping
    public ResponseEntity<List<IssueDetail>> getUserReservations(@ModelAttribute("loggedInUser") User loggedInUser) {
        return ResponseEntity.ok(issueDetailsService.findAllReservedBooksForCurrentUser(loggedInUser));
    }

    @GetMapping("/page")
    public ResponseEntity<ReservedBooksResponse> getAllReservationsPaginated(@ModelAttribute("loggedInUser") User loggedInUser, @RequestParam Optional<Integer> limit, @RequestParam Optional<Integer> skip) {
        if (!loggedInUser.isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Page<IssueDetail> books = issueDetailsService.findAllReservedBooks(limit.orElse(DEFAULT_PAGE_SIZE), skip.orElse(DEFAULT_PAGE_NUMBER));
        return ResponseEntity.ok(new ReservedBooksResponse(books.getContent()));
    }

    @PostMapping("/{bookId}")
    public ResponseEntity<ReservationResponse> reserveBook(@ModelAttribute("loggedInUser") User loggedInUser, @PathVariable String bookId) {
        return bookService.bookById(bookId)
                .map(book -> {
                    IssueDetail reservedBook = issueDetailsService.reserveBookForUser(book, loggedInUser);
                    log.info("User {} reserved book {}", loggedInUser.getName(), bookId);
                    return ResponseEntity.ok(new ReservationResponse(RESERVATION_CREATED, reservedBook.getId()));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/{reservationId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelReservation(@ModelAttribute("loggedInUser") User loggedInUser, @PathVariable String reservationId) {
        issueDetailsService.cancelReservation(reservationId, loggedInUser.get_id());
        log.info("User {} canceled reservation id {}", loggedInUser.getName(), reservationId);
    }
}
