package com.mongodb.devrel.library.infrastructure.repository;

import com.mongodb.devrel.library.domain.model.Book;

import java.util.Optional;

public interface BookRepositoryCustom {
    Optional<Book> findBookWithAvailability(String id);
}
