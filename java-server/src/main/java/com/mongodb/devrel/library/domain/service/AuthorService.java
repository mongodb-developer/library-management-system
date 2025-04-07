package com.mongodb.devrel.library.domain.service;

import com.mongodb.devrel.library.domain.model.Author;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Service
public class AuthorService {

    private final MongoOperations mongoOperations;

    AuthorService(MongoOperations mongoOperations) {
        this.mongoOperations = mongoOperations;
    }

    public Optional<Author> authorById(String id) {

        Aggregation agg = newAggregation(
                match(Criteria.where("_id").is(id)),
                lookup()
                        .from("books")
                        .localField("books")
                        .foreignField("_id")
                        .pipeline(
                                project()
                                        .and("_id").as("isbn")
                                        .andInclude("title", "cover")
                        )
                        .as("books")
        );

        return Optional.ofNullable(mongoOperations.aggregate(agg, "authors", Author.class).getMappedResults().getFirst());
    }
}