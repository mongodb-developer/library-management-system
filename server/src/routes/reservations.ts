import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { protectedRoute } from '../utils/helpers.js';
import { IAuthRequest } from '../utils/typescript.js';
import ReservationsController from '../controllers/reservations.js';
import BookController from '../controllers/books.js';

// The router will be added as a middleware and will take control of requests starting with /reservations.
const reservations = Router({mergeParams: true});
export default reservations;

const reservationController = new ReservationsController();
const bookController = new BookController();
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

reservations.get('/', protectedRoute, async (req: IAuthRequest, res) => {
    const userId = req?.auth?.sub;

    const reservations = await reservationController.getReservations(userId);
    return res.status(200).json(reservations);
});

reservations.get('/:reservationId', async (req, res) => {
    const reservationId = req?.params?.reservationId;

    if (!reservationId) {
        return res.status(400).send({message: reservationController.errors.MISSING_ID});
    }

    try {
        const reservation = await reservationController.getReservation(reservationId);
        return res.status(200).send(reservation);
    } catch (error) {
        if (error === reservationController.errors.NOT_FOUND) {
            return res.status(404).send({message: reservationController.errors.NOT_FOUND});
        }
        return res.status(500).send({message: error});
    }
});

reservations.post('/:bookId', protectedRoute, async (req: IAuthRequest, res) => {
    const username = req?.auth?.name;
    const bookId = req?.params?.bookId;

    if (!username || !bookId) {
        return res.send({message: reservationController.errors.MISSING_DETAILS}).status(400);
    }

    const user = {
        _id: new ObjectId(req?.auth?.sub),
        name: username
    };

    try {
        const insertResult = await reservationController.createReservation(user, bookId);
        return res.status(201).send({
            message: reservationController.success.CREATED,
            insertedId: insertResult.insertedId
        });
    } catch (error) {
        if (error.message == bookController.errors.NOT_FOUND) return res.status(404).send({ message: error.message });
        if (error.message == bookController.errors.NOT_AVAILABLE) {
            return res.status(400).send({message: bookController.errors.NOT_AVAILABLE});
        }
        return res.status(500).send({message: error});
    }
});

reservations.delete('/:bookId', protectedRoute, async (req: IAuthRequest, res) => {
    const userId = req?.auth?.sub;
    const bookId = req?.params?.bookId;

    if (!userId || !bookId) {
        return res.send({message: reservationController.errors.MISSING_DETAILS}).status(400);
    }

    try {
        reservationController.cancelReservation(bookId, userId);
        res.status(200).send({message: reservationController.success.CANCELLED});
    } catch(error) {
        if (error === reservationController.errors.NOT_FOUND) {
            return res.status(404).send({message: reservationController.errors.NOT_FOUND});
        }
        return res.status(500).send({message: error});
    }
});

reservations.get('/user/:userId', protectedRoute, async (req: IAuthRequest, res) => {
    const isAdmin = req?.auth?.isAdmin;
    const userId = req?.params?.userId;

    if (!isAdmin) {
        return res.status(403).send({message: reservationController.errors.ADMIN_ONLY});
    }

    if (!userId) {
        return res.status(400).send({message: reservationController.errors.MISSING_DETAILS});
    }

    const reservations = await reservationController.getReservations(userId);

    return res.status(200).json(reservations);
});