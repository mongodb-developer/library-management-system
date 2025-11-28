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
                .map(book -> new Document(
                        book.synopsis(),
                        Map.of(
                                "id", book.id(),
                                "title", book.title(),
                                "genres", book.genres(),
                                "authors", book.authors()
                                        .stream()
                                        .map(Author::name)
                                        .toList()
                        )
                ))
                .toList();

        vectorStore.add(docs);
    }
}
