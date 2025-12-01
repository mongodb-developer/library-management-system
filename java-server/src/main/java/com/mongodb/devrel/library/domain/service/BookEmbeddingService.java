package com.mongodb.devrel.library.domain.service;

import com.mongodb.devrel.library.domain.model.Book;
import com.mongodb.devrel.library.domain.model.Author;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class BookEmbeddingService {

    private final VectorStore vectorStore;

    BookEmbeddingService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public void storeBooksWithSynopsisEmbedded(List<Book> booksToEmbed) {

        List<Document> docs = booksToEmbed.stream()
                .filter(book -> book.synopsis() != null && !book.synopsis().isBlank())  // Skip books without synopsis
                .map(book -> new Document(
                        book.synopsis(),
                        Map.of(
                                "id", book.id() != null ? book.id() : "",
                                "title", book.title() != null ? book.title() : "Unknown",
                                "genres", book.genres() != null ? book.genres() : List.of(),
                                "authors", book.authors() != null ?
                                        book.authors().stream()
                                                .map(Author::name)
                                                .toList() : List.of()
                        )
                ))
                .toList();

        vectorStore.add(docs);
    }
}
