package com.mongodb.devrel.library.domain.model;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public record User(
     ObjectId _id,
     String name,
     boolean isAdmin) {}