package com.mongodb.devrel.library.resources.repository;

import com.mongodb.devrel.library.domain.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface BookRepository extends MongoRepository<Book, String> {
    // we need to return our book.id as book._id per the JavaScript client and to be on par with the Node server
    Optional<Book> findBookBy_id(String id);

    /**
     * Search books by title or author's name, using a RegExp
     * 
     * @param searchText - text to search, case insensitive
     * @param pageable   - to paginate responses
     * @return a Page of {@link Book} that matches the searchText
     */
    @Query("{$or:[ {title: {$regex: new RegExp(?0, 'i')}}, {'authors.name': {$regex: new RegExp(?0, 'i')}},] }")
    Page<Book> searchByText(String searchText, Pageable pageable);


    @Query("{'_id' : ?0}")
    @Update("{'$inc': {'available': -1}}")
    Integer decreaseAvailableAmountByOne(String bookId);

    @Query("{'_id' : ?0}")
    @Update("{'$inc': {'available': 1}}")
    Integer increaseAvailableAmountByOne(String bookId);
}

