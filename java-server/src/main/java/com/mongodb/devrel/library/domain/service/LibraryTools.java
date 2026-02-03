package com.mongodb.devrel.library.domain.service;

import com.mongodb.devrel.library.domain.model.Author;
import com.mongodb.devrel.library.domain.model.Book;
import com.mongodb.devrel.library.domain.model.User;
import com.mongodb.devrel.library.infrastructure.repository.BookRepository;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class LibraryTools {
    private final BookLookupService bookLookupService;
    private final BookRepository bookRepository;
    private final IssueDetailsService issueDetailsService;

    public LibraryTools(BookLookupService bookLookupService, BookRepository bookRepository, IssueDetailsService issueDetailsService) {
        this.bookLookupService = bookLookupService;
        this.bookRepository = bookRepository;
        this.issueDetailsService = issueDetailsService;
    }

    @Tool(description = """
        Semantic search for books relevant to the user's query.
        Return a short list with id, title, authors.
        Use when the user asks for books by topic or vibe (e.g., 'books about basketball').
        """)
    public List<BookHit> searchBooks(String query) {
        // Implement using your existing semantic lookup
        List<Book> books = bookLookupService.semanticSearchBooks(query);

        return books.stream()
                .map(b -> new BookHit(
                        b.id(),
                        b.title(),
                        b.authors().stream()
                                .map(Author::name)
                                .toList()
                ))
                .toList();
    }

    @Tool(description = "Fetch a single book by its id.")
    public Book getBookById(String id) {
        return bookRepository.findById(id).orElse(null);
    }

    @Tool(description = """
        Reserve a book for a user. Use only when user explicitly asks to reserve/hold.
        Returns confirmation text.
        """)
    public String reserveBook(Book book, User user) {
        // If you already have ReservationService, call it here.
        // reservationService.reserve(userId, bookId);
        issueDetailsService.reserveBookForUser(book, user);
        return "Reserved bookId=" + book.id() + " for userId=" + user._id();
    }

    public record BookHit(String id, String title, List<String> authors) {}
}
