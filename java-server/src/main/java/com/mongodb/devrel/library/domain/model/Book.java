package com.mongodb.devrel.library.domain.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.List;

@Document(collection = "books")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Book {

    @Id
    @JsonProperty("_id")
    private String id;

    private String title;

    private List<Author> authors;

    private List<String> genres;

    private int pages;

    private int year;

    private String synopsis;

    private String cover;

    private List<Attribute> attributes;

    private String isbn;

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
