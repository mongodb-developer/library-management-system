package com.mongodb.devrel.library.domain.model;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "issueDetails")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class IssueDetail {

    public static final String RESERVED = "reservation";
    public static final String BORROWED = "borrowedBook";

    @MongoId
    private String _id;

    private BookExtRef book;

    private LocalDateTime borrowDate;

    private LocalDateTime dueDate;
    
    private LocalDateTime expirationDate;

    private String recordType;

    private boolean returned;

    private LocalDateTime returnedDate;

    private UserExtRef user;

    public IssueDetail(Book book, User user) {
        this();

        this.book = BookExtRef.from(book);
        this.user = UserExtRef.from(user);
        this.expirationDate = LocalDateTime.now().plus(12, ChronoUnit.HOURS);
        recordType = "";
    }

    // Extended Reference Pattern
    @Data
    public static class UserExtRef {
        private ObjectId _id;
        private String name;

        public String get_id() {
            return _id != null ? _id.toHexString() : null;
        }

        public static UserExtRef from(User user) {
            UserExtRef userExtRef = new UserExtRef();

            userExtRef.set_id(user.get_id());
            userExtRef.setName(user.getName());

            return userExtRef;
        }
    }

    @Data
    public static class BookExtRef {
        private String _id;
        private String title;

        public static BookExtRef from(Book book) {
            BookExtRef bookExtRef = new IssueDetail.BookExtRef();

            bookExtRef.setTitle(book.getTitle());
            bookExtRef.set_id(book.get_id());

            return bookExtRef;
        }
    }
}

