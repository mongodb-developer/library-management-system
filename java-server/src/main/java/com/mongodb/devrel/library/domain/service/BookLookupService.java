package com.mongodb.devrel.library.domain.service;

import com.mongodb.devrel.library.domain.model.Book;
import com.mongodb.devrel.library.infrastructure.repository.BookRepository;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BookLookupService {

    private final BookRepository bookRepository;
    private final VectorStore vectorStore;

    public BookLookupService(BookRepository bookRepository, VectorStore vectorStore) {
        this.bookRepository = bookRepository;
        this.vectorStore = vectorStore;
    }

    public List<Book> semanticSearchBooks(String query) {
        List<Document> books = vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(query)
                        .topK(20)
                        .build()
        );

        return resolveRankedBooks(books);
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
