package com.mongodb.devrel.library.domain.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "reviews")
public record Review(
        @Id
        @JsonProperty("_id")
        String id,
        String text,
        Integer rating,
        String name,
        Object timestamp,
        String bookId
){}