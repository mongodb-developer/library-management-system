package com.mongodb.devrel.library.domain.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.List;

@Document(collection = "authors")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Author {

    @MongoId(FieldType.OBJECT_ID)
    @JsonProperty("_id")
    private String id;

    private String name;

    private String sanitizedName;

    private String bio;

    private List<Book> books;

    private List<String> aliases;
}
