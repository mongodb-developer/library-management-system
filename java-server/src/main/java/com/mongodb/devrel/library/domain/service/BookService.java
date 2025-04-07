package com.mongodb.devrel.library.domain.service;

import com.mongodb.devrel.library.domain.model.Book;
import com.mongodb.devrel.library.infrastructure.repository.BookRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BookService {


    private final BookRepository bookRepository;

    BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public Page<Book> findAllBooks(Integer limit, Integer skip) {
        PageRequest request = PageRequest.of(skip, limit, Sort.unsorted());

        // findAll(Pageable) from PagingAndSortingRepository

        return bookRepository.findAll(request);
    }

    public Optional<Book> bookById(String id) {
        return bookRepository.findBookById(id);
    }

    public Page<Book> searchBooks(String theTerm) {
        PageRequest request = PageRequest.of(0, 10, Sort.unsorted());

        return bookRepository.searchByText(theTerm, request);
    }
}
