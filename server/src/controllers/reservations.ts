import { ObjectId } from 'mongodb';
import { collections } from '../database.js';
import { Reservation, ReservationBook, ReservationUser } from '../models/issue-detail.js';
import BookController from './books.js';

const bookController = new BookController();

class ReservationsController {
    errors = {
        MISSING_ID: 'Reservation id is missing',
        MISSING_DETAILS: 'Reservation details are missing',
        NOT_FOUND: 'Reservation not found',
        ADMIN_ONLY: 'This operation is only allowed for admins',
    };

    success = {
        CREATED: 'Reservation created',
        CANCELLED: 'Reservation cancelled'
    };

    RESERVATION_DURATION = 12; // hours

    // Get all reservations for a given user
    public async getReservations(userId: string) {
        const reservations = await collections?.issueDetails?.find({ '_id': new RegExp(`^${userId}R`)}).toArray();
        return reservations;
    }

    // Get a reservation by id
    public async getReservation(reservationId: string) {
        const reservation = await collections?.issueDetails?.findOne({ _id: reservationId });
        if (!reservation) throw new Error(this.errors.NOT_FOUND);
        return reservation;
    }

    // Create a new reservation
    public async createReservation(user: ReservationUser, bookId: string) {
        const bookData = await bookController.getBook(bookId);

        if (!bookData) throw new Error(bookController.errors.NOT_FOUND);
        if (bookData?.available <= 0) throw new Error(bookController.errors.NOT_AVAILABLE);

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
        await bookController.computeAvailableBooks(book._id);
        await this.computeUserReservations(user._id);

        return result;
    }

    public async countReservationsForUser(userId: ObjectId) {
        const count = await collections?.issueDetails?.countDocuments({ '_id': new RegExp(`^${userId}R`) });
        return count;
    }

    public async cancelReservation(bookId: string, userId: string) {
        const reservationId = `${userId}R${bookId}`;
        const deleteResult = await collections?.issueDetails?.deleteOne({ _id: reservationId });

        if (deleteResult.deletedCount === 0) throw new Error(this.errors.NOT_FOUND);

        await bookController.computeAvailableBooks(bookId);
        await this.computeUserReservations(new ObjectId(userId));

        return deleteResult;
    }

    public async computeUserReservations(userId: ObjectId) {
        const reservedCount = await this.countReservationsForUser(userId);
        const result = await collections?.users?.updateOne({ _id: userId }, { $set: { reserved: reservedCount } });
        return result;
    }
}

export default ReservationsController;