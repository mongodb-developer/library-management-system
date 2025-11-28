package com.mongodb.devrel.library.infrastructure.repository;

import com.mongodb.devrel.library.domain.model.Book;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends MongoRepository<Book, String> {
    // we need to return our book.id as book._id per the JavaScript client and to be on par with the Node server
    Optional<Book> findBookById(String id);

    /**
     * Search books by title or author's name, using a RegExp
     * 
     * @param searchText - text to search, case insensitive
     * @param pageable   - to paginate responses
     * @return a List of {@link Book} that matches the searchText
     */
    @Query("{$or:[ {title: {$regex: new RegExp(?0, 'i')}}, {'authors.name': {$regex: new RegExp(?0, 'i')}},] }")
    List<Book> searchByText(String searchText, Pageable pageable);


    @Query("{'_id' : ?0}")
    @Update("{'$inc': {'available': -1}}")
    Integer decreaseAvailableAmountByOne(String bookId);

    @Query("{'_id' : ?0}")
    @Update("{'$inc': {'available': 1}}")
    void increaseAvailableAmountByOne(String bookId);
}

