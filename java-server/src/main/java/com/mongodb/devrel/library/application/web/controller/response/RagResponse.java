package com.mongodb.devrel.library.application.web.controller.response;

import com.mongodb.devrel.library.domain.model.Book;

import java.util.List;

public record RagResponse(
        String answer,
        List<Book> books
) {}
