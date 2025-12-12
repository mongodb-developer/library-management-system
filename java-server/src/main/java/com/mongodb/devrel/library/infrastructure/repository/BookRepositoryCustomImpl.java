package com.mongodb.devrel.library.infrastructure.repository;

import com.mongodb.devrel.library.domain.model.Book;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.LookupOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.Optional;

@Repository
public class BookRepositoryCustomImpl implements BookRepositoryCustom {

    private final MongoTemplate mongoTemplate;

    public BookRepositoryCustomImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public Optional<Book> findBookWithAvailability(String id) {

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

        AggregationResults<Book> results =
                mongoTemplate.aggregate(aggregation, "books", Book.class);

        return results.getMappedResults().stream().findFirst();
    }
}
