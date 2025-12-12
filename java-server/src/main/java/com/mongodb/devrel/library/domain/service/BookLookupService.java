package com.mongodb.devrel.library.domain.service;

import com.mongodb.devrel.library.domain.model.Book;
import com.mongodb.devrel.library.infrastructure.repository.BookRepository;
import org.springframework.ai.document.Document;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BookLookupService {

    private final BookRepository bookRepository;

    public BookLookupService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<Book> resolveRankedBooks(List<Document> docs) {

        List<String> ids = docs.stream()
                .map(d -> d.getMetadata().get("id").toString())
                .toList();

        List<Book> found = bookRepository.findAllById(ids);

        Map<String, Book> byId = found.stream()
                .collect(Collectors.toMap(Book::id, b -> b));

        // preserve vector ranking order

        return ids.stream()
                .map(byId::get)
                .toList();
    }
}
