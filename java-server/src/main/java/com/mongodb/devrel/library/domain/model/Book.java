package com.mongodb.devrel.library.domain.model;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.List;

@Document(collection = "books")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Book {
    @MongoId
    private String _id;

    private String title;

    private List<Author> authors;

    private List<String> genres;

    private int pages;

    private int year;

    private String synopsis;

    private String cover;

    private List<Attribute> attributes;

    /**
     * Number of books in total.
     */
    private int totalInventory;

    /**
     * Number of books currently available.
     * This field is computed. See
     * https://www.mongodb.com/blog/post/building-with-patterns-the-computed-pattern.
     */
    private int available;

    private String binding;

    private String language;

    private String publisher;

    private String longTitle;

    private List<Review> reviews;

    // inserts references in Movie, creates an array ob ObjectIds
    @DocumentReference
    private List<Review> reviewIds;
}
