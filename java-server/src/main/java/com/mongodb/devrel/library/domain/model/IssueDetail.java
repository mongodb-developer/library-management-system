package com.mongodb.devrel.library.domain.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;

@Document(collection = "issueDetails")
public record IssueDetail(

        @MongoId(FieldType.OBJECT_ID)
        @JsonProperty("_id")
        String id,

        BookExtRef book,

        LocalDateTime borrowDate,

        LocalDateTime dueDate,

        LocalDateTime expirationDate,

        String recordType,

        Boolean returned,

        LocalDateTime returnedDate,

        UserExtRef user
) {
    public static final String RESERVED = "reservation";

    public IssueDetail(Book book, User user, String recordType) {
        this(
                null,
                BookExtRef.from(book),
                null,
                null, // dueDate
                LocalDateTime.now().plusHours(12),
                recordType,
                false,
                null,
                UserExtRef.from(user)
        );
    }

    // Extended Reference Pattern
    public record UserExtRef(ObjectId _id, String name) {
        public String get_id() {
            return _id != null ? _id.toHexString() : null;
        }

        public static UserExtRef from(User user) {
            return new UserExtRef(user._id(), user.name());
        }
    }

    public record BookExtRef(String _id, String title) {
        public static BookExtRef from(Book book) {
            return new BookExtRef(book.id(), book.title());
        }
    }
}
