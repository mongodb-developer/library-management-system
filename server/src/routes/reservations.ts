import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { protectedRoute } from '../utils/helpers.js';
import { IAuthRequest } from '../utils/typescript.js';
import { collections } from '../database.js';
import { Reservation } from '../models/issue-detail';

// The router will be added as a middleware and will take control of requests starting with /reservations.
const reservations = Router({mergeParams: true});
export default reservations;

/**
 * Routes
 *
 * GET /reservations: Returns the list of reservations for the logged in user
 * GET /reservations/:reservationId: Returns the details of a reservation.
 * POST /reservations/:bookId: Creates a new reservation.
 * DELETE /reservations/:bookId: Deletes a reservation.
 * GET /reservations/user/:userId: Returns the list of reservations for the specified user.
 *
 */

async function computeAvailableBooks(bookId) {
    const updatePipeline = [
        { $match: { _id: bookId } },
        { $lookup: {
            from: 'issueDetails',
            localField: '_id',
            foreignField: 'book._id',
            as: 'details' },
        },
        { $set: { available: { $subtract: ['$totalInventory', {$size: '$details'}] } } },
        { $unset: 'details' },
        { $merge: { into: 'books', on: '_id', whenMatched: 'replace' } }
    ];
    const result = await collections?.books?.aggregate(updatePipeline);

    return result.toArray();
}

reservations.get('/', protectedRoute, async (req: IAuthRequest, res) => {
    const userId = req?.auth?.sub;

    const reservations = await collections?.issueDetails?.find({ '_id': new RegExp(`^${userId}R`)}).toArray();

    return res.json(reservations).status(200);
});

reservations.get('/:reservationId', async (req, res) => {
    const reservationId = req?.params?.reservationId;

    if (!reservationId) {
        return res.send({message: 'Reservation id is missing'}).status(400);
    }

    const reservation = await collections?.issueDetails?.findOne({ _id: reservationId });

    if (reservation) {
        return res.json(reservation).status(200);
    }

    return res.status(404).send({message: 'Reservation not found'});
});

reservations.post('/:bookId', protectedRoute, async (req: IAuthRequest, res, next) => {
    const username = req?.auth?.name;
    const bookId = req?.params?.bookId;

    if (!username || !bookId) {
        return res.send({message: 'User name or book id is missing'}).status(400);
    }

    const user = {
        _id: new ObjectId(req?.auth?.sub),
        name: username
    };

    const bookData = await collections?.books?.findOne({ _id: bookId });

    if (!bookData) {
        res.status(404).json({message: 'Book not found'});
        return next();
    }

    if (bookData?.available <= 0) {
        return res.status(400).json({message: 'Book is not available'});
    }


    const book = {
        _id: bookData?._id,
        title: bookData?.title,
    };

    const RESERVATION_DURATION = 12; // hours

    const reservation = {
        _id: `${user._id}R${book._id}`,
        book,
        user,
        recordType: 'reservation',
        expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * RESERVATION_DURATION)
    } as Reservation;

    const insertResult = await collections?.issueDetails?.insertOne(reservation);
    await computeAvailableBooks(book._id);

    if (insertResult?.insertedId) {
        return res.status(201).send({
            message: `Created a new reservation with id ${insertResult.insertedId}`,
            insertedId: insertResult.insertedId
        });
    }

    return res.status(500).send({message: 'Failed to create a new reservation'});
});

reservations.delete('/:bookId', protectedRoute, async (req: IAuthRequest, res) => {
    const userId = req?.auth?.sub;
    const bookId = req?.params?.bookId;

    if (!userId || !bookId) {
        return res.send({message: 'User id or book id is missing'}).status(400);
    }

    const deleteResult = await collections?.issueDetails?.deleteOne({ _id: `${userId}R${bookId}` });
    await computeAvailableBooks(bookId);

    if(deleteResult?.deletedCount) {
        return res.json({
            message: `Deleted ${deleteResult.deletedCount} reservation(s)`,
            deletedCount: deleteResult.deletedCount
        }).status(200);
    }

    return res.status(500).send({message: 'Failed to delete reservation'});
});

reservations.get('/user/:userId', protectedRoute, async (req: IAuthRequest, res) => {
    const isAdmin = req?.auth?.isAdmin;
    const userId = req?.params?.userId;

    if (!isAdmin) {
        return res.status(403).send({message: 'Only administrators can see reservation lists'});
    }

    if (!userId) {
        return res.status(400).send({message: 'User id is missing'});
    }

    const reservations = await collections?.issueDetails?.find({ '_id': new RegExp(`^${userId}R`)}).toArray();

    return res.status(200).json(reservations);
});