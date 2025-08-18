package com.mongodb.devrel.library.domain.service;

import com.mongodb.devrel.library.domain.model.Book;
import com.mongodb.devrel.library.domain.model.IssueDetail;
import com.mongodb.devrel.library.domain.model.User;
import com.mongodb.devrel.library.infrastructure.repository.BookRepository;
import com.mongodb.devrel.library.infrastructure.repository.IssueDetailsRepository;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class IssueDetailsService {

    private final IssueDetailsRepository issueDetailsRepository;

    private final BookRepository bookRepository;

    IssueDetailsService(IssueDetailsRepository issueDetailsRepository, BookRepository bookRepository) {
        this.issueDetailsRepository = issueDetailsRepository;
        this.bookRepository = bookRepository;
    }

    public Page<IssueDetail> findAllBorrowedBooks(Integer limit, Integer skip) {
        PageRequest request = PageRequest.of(skip, limit, Sort.unsorted());

        return issueDetailsRepository.findAllBorrowedBooks(request);
    }

    public List<IssueDetail> findAllBorrowedBooksForCurrentUser(User user) {
       return issueDetailsRepository.findBorrowedBooksForUserId(user._id());
    }

    public Page<IssueDetail> findAllReservedBooks(Integer limit, Integer skip) {
        PageRequest request = PageRequest.of(skip, limit, Sort.unsorted());

        return issueDetailsRepository.findAllReservedBooks(request);
    }

    public List<IssueDetail> findAllReservedBooksForCurrentUser(User user) {
        return issueDetailsRepository.findReservedBooksForUserId(user._id());
    }

    public IssueDetail reserveBookForUser(Book book, User user) {
        IssueDetail issueDetail = new IssueDetail(book, user, IssueDetail.RESERVED);

        IssueDetail insertedIssue = issueDetailsRepository.insert(issueDetail);
        bookRepository.decreaseAvailableAmountByOne(book.id());

        return insertedIssue;
    }

    public void cancelReservation(String bookId, ObjectId userId) {
        issueDetailsRepository.cancelReservation(bookId, userId);
    }

    public void lendBookToUser(String bookId, String userId) {
        issueDetailsRepository.lendBookToUser(bookId, userId, LocalDateTime.now(), LocalDateTime.now().plusHours(12));
    }

    public void userReturnsBook(String bookId, String userId) {
        issueDetailsRepository.userReturnsBook(bookId, userId, LocalDateTime.now());
        bookRepository.increaseAvailableAmountByOne(bookId);

    }
}