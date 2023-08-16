import { ObjectId } from 'mongodb';

/**
 * IssueDetail follows the single-collection pattern.
 * The detail is either a borrowed book or a reservation.
 * The type of detail is indicated by the recordType field.
 * See https://www.mongodb.com/blog/post/building-with-patterns-the-single-collection-pattern.
 */
export type IssueDetail = BorrowedBook | Reservation;

interface ReservationUser {
    _id: ObjectId;
    name: string;
}

interface ReservationBook {
    _id: string;
    title: string;
}

enum IssueDetailType {
    Reservation = 'R',
    BorrowedBook = 'B'
}

interface BorrowedBook extends IssueDetailBase {
    /**
     * Date when the book was borrowed.
     */
    borrowDate: Date;
    /**
     * Date when the book is due to be returned.
     */
    dueDate: Date;
    /**
     * Date when the book was returned.
     * (optional) set when the book is returned.
     */
    returnedDate?: Date;
    /**
     * Boolean indicating if the book was returned.
     */
    returned: boolean;
}

interface Reservation extends IssueDetailBase {
    /**
     * Date when the reservation expires.
     * TTL index applied to this field to automatically remove the reservation.
     */
    expirationDate: Date;
}

interface IssueDetailBase {
    /**
     * Identifier with the format 'userId_objectId' to optimize querying by user.
     * db.issueDetails.find({ _id: /^userId/ })
    */
    _id: string;

    /**
     * Type of record: 'borrowedBook' or 'reservation'.
     */
    recordType: string;

    /**
     * Reference to the book collection following the extended reference pattern.
     * See https://www.mongodb.com/blog/post/building-with-patterns-the-extended-reference-pattern.
     */
    book: ReservationBook;

    /**
     * Reference to the user collection following the extended reference pattern.
     * See https://www.mongodb.com/blog/post/building-with-patterns-the-extended-reference-pattern.
     */
    user: ReservationUser;
}

export {
    BorrowedBook,
    IssueDetailType,
    Reservation,
    ReservationBook,
    ReservationUser
};
