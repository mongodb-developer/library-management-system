package com.mongodb.devrel.library.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Document(collection = "reviews")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Review {
    @MongoId
    private String _id;
    private String text;
    private Integer rating;
    private String name;

    private Object timestamp;
    private String bookId;
}