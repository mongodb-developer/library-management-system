package com.mongodb.devrel.library.domain.service;

import com.mongodb.devrel.library.application.web.controller.util.SearchType;
import com.mongodb.devrel.library.domain.model.Book;
import com.mongodb.devrel.library.infrastructure.repository.BookRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    private static final PageRequest DEFAULT_PAGE = PageRequest.of(0, 10);

    private final BookRepository bookRepository;
    private final BookLookupService bookLookupService;

    public BookService(BookRepository bookRepository, BookLookupService bookLookupService) {
        this.bookRepository = bookRepository;
        this.bookLookupService = bookLookupService;
    }

    public Page<Book> findAllBooks(Integer pageNumber, Integer size) {
        PageRequest request = PageRequest.of(pageNumber, size, Sort.unsorted());
        return bookRepository.findAll(request);
    }

    public Optional<Book> getBook(String id) {
        return bookRepository.findBookWithAvailability(id);
    }

    public List<Book> searchBooks(String term, SearchType searchType) {

        return switch (searchType) {
            case KEYWORD -> bookRepository.searchByText(term, DEFAULT_PAGE);
            case SEMANTIC -> bookLookupService.semanticSearchBooks(term);
        };
    }

    public void incrementBookInventory(String reservationId) {
        bookRepository.increaseAvailableAmountByOne(reservationId);
    }
}


