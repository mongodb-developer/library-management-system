import { ObjectId } from 'mongodb';
import { collections } from '../database.js';
import { BookType, BorrowedBook, Reservation, ReservationBook, ReservationUser } from '../models/issue-detail.js';
import BookController from './books.js';

const bookController = new BookController();

class ReservationsController {
    errors = {
        MISSING_ID: 'Reservation id is missing',
        MISSING_DETAILS: 'Reservation details are missing',
        NOT_FOUND: 'Reservation not found',
        ADMIN_ONLY: 'This operation is only allowed for admins',
        INVALID_TYPE: 'Invalid type',
        ALREADY_RETURNED: 'Book is already returned',
        ALREADY_BOOKED: 'Book is already booked',
    };

    success = {
        CREATED: 'Reservation created',
        CANCELLED: 'Reservation cancelled'
    };

    types = {
        RESERVATION: 'reservation',
        BORROWED_BOOK: 'borrowedBook'
    };

    RESERVATION_DURATION = 12; // hours
    BORROWED_DURATION = 21; // days

    private async getIssueDetailsForUser(userId: string, type: BookType) {
        const middleCode = type === this.types.RESERVATION ? 'R' : 'B';
        const filter =  { '_id': new RegExp(`^${userId}${middleCode}`)};
        if (type === this.types.BORROWED_BOOK) filter['returned'] = false;
        const issueDetails = await collections?.issueDetails?.find(filter).toArray();
        return issueDetails;
    }

    // Get all reservations for a given user
    public async getReservations(userId: string) {
        return this.getIssueDetailsForUser(userId, this.types.RESERVATION as BookType);
    }

    // Get a reservation by id
    public async getReservation(reservationId: string) {
        const reservation = await collections?.issueDetails?.findOne({ _id: reservationId });
        if (!reservation) throw new Error(this.errors.NOT_FOUND);
        return reservation;
    }

    // Create a new reservation
    public async createReservation(user: ReservationUser, bookId: string) {
        const bookData = await bookController.isBookAvailable(bookId);
        const book = {
            _id: bookData?._id,
            title: bookData?.title,
        } as ReservationBook;

        const reservation = {
            _id: `${user._id}R${book._id}`,
            book,
            user,
            recordType: 'reservation',
            expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * this.RESERVATION_DURATION)
        } as Reservation;

        const result = await collections?.issueDetails?.insertOne(reservation);
        await Promise.all([
            bookController.computeAvailableBooks(book._id),
            this.computeUserInHand(user._id)
        ]);

        return result;
    }

    public async countBooksForUser(userId: ObjectId, type?: BookType) {
        let filterValue = `^${userId}`;
        if (type === this.types.RESERVATION) filterValue += 'R';
        if (type === this.types.BORROWED_BOOK) filterValue += 'B';
        const filter = new RegExp(filterValue);
        const count = await collections?.issueDetails?.countDocuments({ '_id': filter });
        return count;
    }

    public async countReservationsForUser(userId: ObjectId) {
        return await this.countBooksForUser(userId, this.types.RESERVATION as BookType);
    }

    public async countBorrowedBooksForUser(userId: ObjectId) {
        return await this.countBooksForUser(userId, this.types.BORROWED_BOOK as BookType);
    }

    public async countReservationsAndBorrowedBooksForUser(userId: ObjectId) {
        return await this.countBooksForUser(userId);
    }

    public async cancelReservation(bookId: string, userId: string) {
        const reservationId = `${userId}R${bookId}`;
        const deleteResult = await collections?.issueDetails?.deleteOne({ _id: reservationId });

        if (deleteResult.deletedCount === 0) throw new Error(this.errors.NOT_FOUND);

        await Promise.all([
            bookController.computeAvailableBooks(bookId),
            this.computeUserInHand(new ObjectId(userId))
        ]);

        return deleteResult;
    }

    public async computeUserInHand(userId: ObjectId) {
        let counts;
        try {
            counts = await Promise.all([
                this.countReservationsForUser(userId),
                this.countBorrowedBooksForUser(userId),
                this.countReservationsAndBorrowedBooksForUser(userId)
            ]);
        } catch (error) {
            throw new Error(error);
        }
        const set = {
            reserved: counts[0],
            borrowed: counts[1],
            totalInHand: counts[2]
        };
        const result = await collections?.users?.updateOne({ _id: userId }, { $set: set });
        return result;
    }

    public async borrowBook(bookId: string, user: ReservationUser) {
        let bookData;
        try {
            bookData = await bookController.isBookAvailable(bookId);
        } catch (e) {
            throw new Error(e.message);
        }
        const book = {
            _id: bookData?._id,
            title: bookData?.title,
        } as ReservationBook;

        const borrow = {
            _id: `${user._id}B${book._id}`,
            book,
            user,
            recordType: 'borrowedBook',
            borrowDate: new Date(Date.now()),
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * this.BORROWED_DURATION),
            returned: false
        } as BorrowedBook;

        let result;
        try {
            result = await collections?.issueDetails?.insertOne(borrow);
        } catch (e) {
            if (e.code === 11000) {
                // Duplicate key, book was previously borrowed
                // Check if the user still has the book
                const existingBorrow = await collections?.issueDetails?.findOne({ _id: `${user._id}B${bookId}` }) as BorrowedBook;
                if (existingBorrow?.returned === false) throw new Error(this.errors.ALREADY_BOOKED);
                // For the sake of simplicity, we update the booking when the user re-borrows the book
                result = await collections?.issueDetails?.updateOne({
                    _id: `${user._id}B${bookId}`
                }, {
                    $set: {
                        returned: false,
                        dueDate: borrow.dueDate,
                        borrowDate: borrow.borrowDate
                    }
                });
            } else {
                throw new Error(e);
            }
        }
        // Delete matching reservation if one then re-compute computed fields
        await collections?.issueDetails?.deleteOne({ _id: `${user._id}R${bookId}` });
        await Promise.all([
            bookController.computeAvailableBooks(book._id),
            this.computeUserInHand(user._id)
        ]);

        return result;
    }

    public async getBorrows(userId: string) {
        return this.getIssueDetailsForUser(userId, this.types.BORROWED_BOOK as BookType);
    }

    public async returnBook(userId: string, bookId: string) {
        const borrowId = `${userId}B${bookId}`;
        const borrow = await collections?.issueDetails?.findOne({ _id: borrowId }) as BorrowedBook;

        if (!borrow) throw new Error(this.errors.NOT_FOUND);
        if (borrow.returned) throw new Error(this.errors.ALREADY_RETURNED);

        const result = await collections?.issueDetails?.updateOne({ _id: borrowId }, { $set: { returned: true, returnedDate: new Date() } });
        await Promise.all([
            bookController.computeAvailableBooks(bookId),
            this.computeUserInHand(new ObjectId(userId))
        ]);

        return result;
    }

    public async getBorrowedHistory(userId: string) {
        const borrowedBooks = await collections?.issueDetails?.find({
            _id: new RegExp(`^${userId}B`),
            returned: true
        }).toArray();
        return borrowedBooks;
    }
}

export default ReservationsController;