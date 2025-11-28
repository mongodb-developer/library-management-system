package com.mongodb.devrel.library.infrastructure.config;

import com.mongodb.devrel.library.domain.model.Book;
import com.mongodb.devrel.library.domain.service.BookEmbeddingService;
import com.mongodb.devrel.library.domain.service.BookService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

@Component
public class EmbeddingInitializer {

    private static final int BATCH_SIZE = 200;

    private final BookService bookService;
    private final BookEmbeddingService bookEmbeddingService;
    private final MongoTemplate mongoTemplate;

    @Value("${spring.ai.vectorstore.mongodb.collection-name}")
    private String vectorCollectionName;

    public EmbeddingInitializer(BookService bookService, BookEmbeddingService bookEmbeddingService, MongoTemplate mongoTemplate) {
        this.bookService = bookService;
        this.bookEmbeddingService = bookEmbeddingService;
        this.mongoTemplate = mongoTemplate;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void embedBooksOnStartup() {

        long count = mongoTemplate
                .getCollection(vectorCollectionName)
                .countDocuments();

        if (count > 0) {
            return;
        }

        System.out.println("Generating book embeddings in batches…");

        int page = 0;
        Page<Book> batch;

        do {
            batch = bookService.findAllBooks(page, BATCH_SIZE);

            if (!batch.isEmpty())
                bookEmbeddingService.storeBooksWithSynopsisEmbedded(batch.stream().toList());

            page++;

        } while (!batch.isLast());

        System.out.println("Finished generating vector embeddings.");
    }
}
