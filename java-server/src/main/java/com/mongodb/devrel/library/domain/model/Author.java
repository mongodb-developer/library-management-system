package com.mongodb.devrel.library.domain.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.List;

@Document(collection = "authors")
public record Author(
        @MongoId(FieldType.OBJECT_ID)
        @JsonProperty("_id")
        String id,
        String name,
        String sanitizedName,
        String bio,
        List<Book> books,
        List<String> aliases
) {
}
