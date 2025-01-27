package com.mongodb.devrel.library.service;

import com.mongodb.devrel.library.model.Book;
import com.mongodb.devrel.library.repository.BookRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;

    public Page<Book> findAllBooks(Integer limit, Integer skip) {
        PageRequest request = PageRequest.of(skip, limit, Sort.unsorted());

        // findAll(Pageable) from PagingAndSortingRepository
        Page<Book> books = bookRepository.findAll(request);

        return books;
    }

    public Optional<Book> bookById(String id) {
        return bookRepository.findBookBy_id(id);
    }

    public Page<Book> searchBooks(String theTerm) {
        PageRequest request = PageRequest.of(0, 10, Sort.unsorted());

        Page<Book> books = bookRepository.searchByText(theTerm, request);    

        return books;
    }
}
