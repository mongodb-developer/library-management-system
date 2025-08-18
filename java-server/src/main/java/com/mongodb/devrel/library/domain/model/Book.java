package com.mongodb.devrel.library.domain.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "books")
public record Book(

    @Id
    @JsonProperty("_id")
    String id,

    String title,

    List<Author> authors,

    List<String> genres,

    Integer pages,

    Integer year,

    String synopsis,

    String cover,

    List<Attribute> attributes,

    String isbn,

    Integer totalInventory,

    Integer available,

    String binding,

    String language,

    String publisher,

    String longTitle,

    List<Review> reviews,

    List<Review> reviewIds) {

}
