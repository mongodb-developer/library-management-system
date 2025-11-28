package com.mongodb.devrel.library.domain.service;

import com.mongodb.devrel.library.application.web.controller.util.SearchType;
import com.mongodb.devrel.library.domain.model.Book;
import com.mongodb.devrel.library.infrastructure.repository.BookRepository;
import org.bson.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.LookupOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final MongoTemplate mongoTemplate;
    private final VectorStore vectorStore;
    // private final EmbeddingProvider embeddingProvider; removing this as we will use the Spring AI integration

    BookService(BookRepository bookRepository, MongoTemplate mongoTemplate, VectorStore vectorStore) {
        this.bookRepository = bookRepository;
        this.mongoTemplate = mongoTemplate;
        this.vectorStore = vectorStore;
    }

    public Page<Book> findAllBooks(Integer pageNumber, Integer size) {
        PageRequest request = PageRequest.of(pageNumber, size, Sort.unsorted());
        return bookRepository.findAll(request);
    }

    public Optional<Book> getBook(String id) {
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("_id").is(id)),
                LookupOperation.newLookup()
                        .from("issueDetails")
                        .localField("_id")
                        .foreignField("book._id")
                        .pipeline(
                                Aggregation.match(new Criteria().orOperator(
                                        Criteria.where("recordType").is("reservation"),
                                        Criteria.where("recordType").is("borrowedBook").and("returned").is(false)
                                ))
                        )
                        .as("details"),
                Aggregation.addFields()
                        .addFieldWithValue("available",
                                new Document("$subtract", Arrays.asList("$totalInventory", new Document("$size", "$details"))))
                        .build(),
                Aggregation.project().andExclude("details")
        );

        AggregationResults<Book> results = mongoTemplate.aggregate(aggregation, "books", Book.class);

        return results.getMappedResults().stream().findFirst();
    }

    public List<Book> searchBooks(String theTerm, SearchType searchType) {
        if (searchType == SearchType.KEYWORD) {
            PageRequest request = PageRequest.of(0, 10);
            return bookRepository.searchByText(theTerm, request);
        } else {
            List<org.springframework.ai.document.Document> results =
                    semanticallySearchBooks(theTerm);

            List<String> ids = results.stream()
                    .map(d -> d.getMetadata().get("bookId").toString())
                    .toList();

            List<Book> found = bookRepository.findAllById(ids);

            // preserve vector search order
            Map<String, Book> byId =
                    found.stream().collect(Collectors.toMap(Book::id, b -> b));

            return ids.stream().map(byId::get).toList();
        }
    }

    public List<org.springframework.ai.document.Document> semanticallySearchBooks(String query) {
        return vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(query)
                        .topK(20)
                        .build()
        );
    }

    public void incrementBookInventory(String reservationId) {
        bookRepository.increaseAvailableAmountByOne(reservationId);
    }
}


