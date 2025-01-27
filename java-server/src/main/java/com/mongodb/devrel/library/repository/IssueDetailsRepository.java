package com.mongodb.devrel.library.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.repository.DeleteQuery;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;

import com.mongodb.devrel.library.model.IssueDetail;

@Repository
public interface IssueDetailsRepository extends MongoRepository<IssueDetail, String> {

    @Query("{ 'recordType': 'borrowedBook' }")
    Page<IssueDetail> findAllBorrowedBooks(Pageable page);

    @Query("{ 'recordType': 'reservation' }")
    Page<IssueDetail> findAllReservedBooks(Pageable page);

    @Query("{ 'user._id': ?0, 'recordType': 'borrowedBook' }")
    List<IssueDetail> findBorrowedBooksForUserId(String userId);

    @Query("{ 'user._id': ?0, 'recordType': 'reservation' }")
    List<IssueDetail> findReservedBooksForUserId(ObjectId userId);

    @DeleteQuery("{ 'book._id' : ?0, 'user._id': new ObjectId('?1') }")
    Integer cancelReservation(String bookId, ObjectId userId);

    @Query("{ 'book._id' : ?0, 'user._id': new ObjectId('?1') }")
    @Update("""
        {
            $set: {
                'recordType': 'borrowedBook',
                'returned': false,
                'borrowDate': ?2,
                'dueDate': ?3
            }
        }
    """)
    Integer lendBookToUser(String bookId, String userId, LocalDateTime currentDate, LocalDateTime dueDate);

    @Query("{ 'book._id' : ?0, 'user._id': new ObjectId('?1') }")
    @Update("""
                {
                    $set: {
                        'returned': true,
                        'returnedDate': ?2
                    }
                }
            """)
    Integer userReturnsBook(String bookId, String userId, LocalDateTime currentDate);
}