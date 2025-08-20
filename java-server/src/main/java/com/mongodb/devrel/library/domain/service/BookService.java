package com.mongodb.devrel.library.domain.service;

import com.mongodb.devrel.library.domain.model.Book;
import com.mongodb.devrel.library.infrastructure.repository.BookRepository;
import org.bson.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.LookupOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;


import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final MongoTemplate mongoTemplate;

    BookService(BookRepository bookRepository, MongoTemplate mongoTemplate) {
        this.bookRepository = bookRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public Page<Book> findAllBooks(Integer limit, Integer skip) {
        PageRequest request = PageRequest.of(skip, limit, Sort.unsorted());
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

    public List<Book> searchBooks(String theTerm) {
        PageRequest request = PageRequest.of(0, 10, Sort.unsorted());
        return bookRepository.searchByText(theTerm, request);
    }

    public void incrementBookInventory(String reservationId) {
        bookRepository.increaseAvailableAmountByOne(reservationId);
    }
}
