import { ObjectId, UpdateResult } from 'mongodb';
import { collections } from '../database.js';
import { BorrowedBook, IssueDetail, IssueDetailType, Reservation, ReservationBook, ReservationUser } from '../models/issue-detail.js';
import BookController from './books.js';
import UserController from './user.js';
import { User } from '../models/user.js';
import { Book } from '../models/book.js';

const bookController = new BookController();
const userController = new UserController();

class ReservationsController {
    errors = {
        MISSING_ID: 'Reservation id is missing',
        MISSING_DETAILS: 'Reservation details are missing',
        NOT_FOUND: 'Reservation not found',
        ADMIN_ONLY: 'This operation is only allowed for admins',
        INVALID_TYPE: 'Invalid type',
        ALREADY_RETURNED: 'Book is already returned',
        ALREADY_BOOKED: 'Book is already booked',
        INVALID_USER_ID: 'Invalid user id',
        INVALID_BOOK_ID: 'Invalid book id',
    };

    success = {
        CREATED: 'Reservation created',
        CANCELLED: 'Reservation cancelled'
    };

    RESERVATION_DURATION = 0.5; // 0.5 days -> 12 hours
    BORROWED_DURATION = 21; // days

    private async getRecentIssueDetails(type: IssueDetailType, limit = 50, skip = 0) {
        const filter = {
            recordType: (type === IssueDetailType.BorrowedBook) ? 'borrowedBook' : 'reservation',
        };

        const sortField = (type === IssueDetailType.BorrowedBook) ? 'borrowDate' : 'expirationDate';

        return await collections?.issueDetails?.find(filter)
            .sort(sortField, 'descending')
            .limit(limit)
            .skip(skip)
            .toArray();
    }

    private async getIssueDetailsForUser(userId: string, type: IssueDetailType) {
        const filter =  {
            '_id': new RegExp(`^${userId}${type}`)
        };

        if (type === IssueDetailType.BorrowedBook) {
            filter['returned'] = false;
        }

        const issueDetails = await collections?.issueDetails?.find(filter).toArray();

        return issueDetails;
    }

    private getDueDate(type: string) {
        const now = Date.now();
        const daysInMs = 1000 * 60 * 60 * 24;
        const duration = type === IssueDetailType.Reservation ? this.RESERVATION_DURATION : this.BORROWED_DURATION;
        const dueDate = new Date(now + daysInMs * duration);
        return new Date(dueDate);
    }

    private getIssueDetailsId(bookId: string, userId: string, type: string) {
        return `${userId}${type}${bookId}`;
    }

    private getReservationId(bookId: string, userId: string) {
        return this.getIssueDetailsId(bookId, userId, IssueDetailType.Reservation);
    }

    private getBorrowedBookId(bookId: string, userId: string) {
        return this.getIssueDetailsId(bookId, userId, IssueDetailType.BorrowedBook);
    }

    public async getReservations(userId: string) {
        return this.getIssueDetailsForUser(userId, IssueDetailType.Reservation);
    }

    public async getReservation(reservationId: string) {
        const reservation = await collections?.issueDetails?.findOne({ _id: reservationId });
        if (!reservation) throw new Error(this.errors.NOT_FOUND);
        return reservation;
    }

    public async getRecentReservations(limit = 50, skip = 0) {
        if (limit > 100) {
            limit = 100;
        }

        if (skip < 0) {
            skip = 0;
        }

        return this.getRecentIssueDetails(IssueDetailType.Reservation, limit, skip);
    }

    public async getBookReservationByUser(bookId: string, userId: string) {
        const reservation = await collections?.issueDetails?.findOne({ _id: this.getReservationId(bookId, userId) });

        return reservation;
    }

    public async createReservation(user: ReservationUser, bookId: string) {
        const bookData = await bookController.isBookAvailable(bookId);
        const book = {
            _id: bookData?._id,
            title: bookData?.title,
        } as ReservationBook;

        const reservation = {
            _id: this.getReservationId(book._id, user._id.toString()),
            book,
            user,
            recordType: 'reservation',
            expirationDate: this.getDueDate(IssueDetailType.Reservation),
        } as Reservation;

        const result = await collections?.issueDetails?.insertOne(reservation);
        await Promise.all([
            bookController.decrementBookInventory(book._id),
            this.computeUserInHand(user._id)
        ]);

        return result;
    }

    public async countBooksForUser(userId: ObjectId, type?: IssueDetailType) {
        const filterValue = `^${userId}${type}`;
        const filter = new RegExp(filterValue);
        const count = await collections?.issueDetails?.countDocuments({ '_id': filter });
        return count;
    }

    public async countReservationsForUser(userId: ObjectId) {
        return await this.countBooksForUser(userId, IssueDetailType.Reservation);
    }

    public async countBorrowedBooksForUser(userId: ObjectId) {
        return await this.countBooksForUser(userId, IssueDetailType.BorrowedBook);
    }

    public async countReservationsAndBorrowedBooksForUser(userId: ObjectId) {
        return await this.countBooksForUser(userId);
    }

    public async cancelReservation(bookId: string, userId: string) {
        const reservationId = this.getReservationId(bookId, userId);
        const deleteResult = await collections?.issueDetails?.deleteOne({ _id: reservationId });

        if (deleteResult.deletedCount === 0) throw new Error(this.errors.NOT_FOUND);

        await Promise.all([
            bookController.incrementBookInventory(bookId),
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

    public async borrowBook(bookId: string, userId: string) {
        let bookData: Book | null;
        try {
            bookData = await bookController.getBook(bookId);
        } catch (e) {
            console.error(e);
            throw new Error(this.errors.INVALID_BOOK_ID);
        }

        if (!bookData) {
            console.error(`Book with id ${bookId} not found`);
            throw new Error(this.errors.INVALID_BOOK_ID);
        }

        const book = {
            _id: bookData._id,
            title: bookData.title,
        } as ReservationBook;

        let userData: User | null;
        try {
            userData = await userController.getUserById(userId);
        } catch (e) {
            console.error(e);
            throw new Error(this.errors.INVALID_USER_ID);
        }

        if (!userData) {
            console.error(`User with id ${userId} not found`);
            throw new Error(this.errors.INVALID_USER_ID);
        }

        const user = {
            _id: userData._id,
            name: userData.name
        } as ReservationUser;

        const borrow = {
            _id: this.getBorrowedBookId(book._id, userId),
            book,
            user,
            recordType: 'borrowedBook',
            borrowDate: new Date(Date.now()),
            dueDate: this.getDueDate(IssueDetailType.BorrowedBook),
            returned: false
        } as BorrowedBook;

        let upsertResult: UpdateResult<IssueDetail>;
        try {
            upsertResult = await collections?.issueDetails?.updateOne({ _id: borrow._id }, { $set: borrow }, { upsert: true });
        } catch (e) {
            throw new Error(e.message);
        }

        // Delete matching reservation if one then re-compute computed fields
        const reservationId = this.getReservationId(bookId, userId);
        const deleteResult = await collections?.issueDetails?.deleteOne({ _id: reservationId });

        const computes = [this.computeUserInHand(user._id)];
        const borrowReplacesReservation = deleteResult.deletedCount === 1;
        const borrowIsRenewal = upsertResult.modifiedCount === 1;
        if (!borrowReplacesReservation && !borrowIsRenewal) {
            computes.push(bookController.decrementBookInventory(book._id));
        }

        await Promise.all(computes);

        return upsertResult;
    }

    public async getBorrows(userId: string) {
        return this.getIssueDetailsForUser(userId, IssueDetailType.BorrowedBook);
    }

    public async getRecentBorrows(limit = 50, skip = 0) {
        if (limit > 100) {
            limit = 100;
        }

        if (skip < 0) {
            skip = 0;
        }

        return this.getRecentIssueDetails(IssueDetailType.BorrowedBook, limit, skip);
    }

    public async returnBook(userId: string, bookId: string) {
        const borrowId = this.getBorrowedBookId(bookId, userId);
        const borrow = await collections?.issueDetails?.findOne({ _id: borrowId }) as BorrowedBook;

        if (!borrow) {
            console.error(this.errors.NOT_FOUND);
            throw new Error(this.errors.NOT_FOUND);
        }

        console.dir(borrow);
        if (borrow.returned) {
            console.error(this.errors.ALREADY_RETURNED);
            throw new Error(this.errors.ALREADY_RETURNED);
        }

        const result = await collections?.issueDetails?.updateOne(
            { _id: borrowId },
            {
                $set: { returned: true, returnedDate: new Date()}
            }
        );

        await Promise.all([
            bookController.incrementBookInventory(bookId),
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