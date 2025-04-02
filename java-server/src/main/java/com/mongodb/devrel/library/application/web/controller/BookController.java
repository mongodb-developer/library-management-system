package com.mongodb.devrel.library.application.web.controller;


import com.mongodb.devrel.library.domain.model.Book;
import com.mongodb.devrel.library.domain.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/books")
public class BookController {

    private final BookService bookService;

    BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks(@RequestParam Optional<Integer> limit, @RequestParam Optional<Integer> skip) {

        Integer theLimit = limit.orElse(10);
        Integer theSkip = skip.orElse(0);
        Page<Book> books = bookService.findAllBooks(theLimit, theSkip);

        return new ResponseEntity<>(books.getContent(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Book>> getBook(@PathVariable String id) {
        return new ResponseEntity<Optional<Book>>(bookService.bookById(id), HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Book>> searchBooks(@RequestParam Optional<String> term) {

        String theTerm = term.orElse("");
        Page<Book> books = bookService.searchBooks(theTerm);

        return new ResponseEntity<>(books.getContent(), HttpStatus.OK);
    }

}
