import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { protectedRoute, adminRoute } from '../utils/middlewares.js';
import { Request as AuthRequest } from 'express-jwt';
import IssueDetailsController from '../controllers/issue-details.js';
import BookController from '../controllers/books.js';

// The router will be added as a middleware and will take control of requests starting with /reservations.
const reservations = Router({mergeParams: true});
export default reservations;

const issueDetailsController = new IssueDetailsController();
const bookController = new BookController();
/**
 * Routes
 *
 * GET /reservations/page: Returns a page of reservations.
 * GET /reservations: Returns the list of reservations for the logged in user
 * GET /reservations/:reservationId: Returns the details of a reservation.
 * POST /reservations/:bookId: Creates a new reservation.
 * DELETE /reservations/:bookId: Deletes a reservation.
 * GET /reservations/user/:userId: Returns the list of reservations for the specified user.
 *
 */

reservations.get('/', protectedRoute, async (req: AuthRequest, res) => {
    const userId = req?.auth?.sub;

    const reservations = await issueDetailsController.getReservations(userId);
    return res.status(200).json(reservations);
});

reservations.get('/page', protectedRoute, adminRoute, async (req: AuthRequest, res) => {
    const limit = parseInt(req?.query?.limit as string) || undefined;
    const skip = parseInt(req?.query?.skip as string) || undefined;

    const reservations = await issueDetailsController.getPagedReservations(limit, skip);

    return res.status(200).json(reservations);
});

reservations.get('/:reservationId', async (req, res) => {
    const reservationId = req?.params?.reservationId;

    if (!reservationId) {
        return res.status(400).send({message: issueDetailsController.errors.MISSING_ID});
    }

    try {
        const reservation = await issueDetailsController.getReservation(reservationId);
        return res.status(200).send(reservation);
    } catch (error) {
        if (error.message == issueDetailsController.errors.NOT_FOUND) {
            return res.status(404).send({message: issueDetailsController.errors.NOT_FOUND});
        }
        return res.status(500).send({message: error});
    }
});

reservations.post('/:bookId', protectedRoute, async (req: AuthRequest, res) => {
    const username = req?.auth?.name;
    const bookId = req?.params?.bookId;

    if (!username || !bookId) {
        return res.send({message: issueDetailsController.errors.MISSING_DETAILS}).status(400);
    }

    const user = {
        _id: new ObjectId(req?.auth?.sub),
        name: username
    };

    try {
        const result = await issueDetailsController.createReservation(user, bookId);

        return res.status(201).send({
            message: issueDetailsController.success.CREATED,
            insertedId: result.insertedId
        });
    } catch (error) {
        if (error.message == bookController.errors.NOT_FOUND) return res.status(404).send({ message: error.message });
        if (error.message == bookController.errors.NOT_AVAILABLE) {
            return res.status(400).send({message: bookController.errors.NOT_AVAILABLE});
        }
        return res.status(500).send({message: error});
    }
});

reservations.delete('/:bookId', protectedRoute, async (req: AuthRequest, res) => {
    const userId = req?.auth?.sub;
    const bookId = req?.params?.bookId;

    if (!userId || !bookId) {
        return res.send({message: issueDetailsController.errors.MISSING_DETAILS}).status(400);
    }

    try {
        await issueDetailsController.cancelReservation(bookId, userId);
        res.status(200).send({message: issueDetailsController.success.CANCELLED});
    } catch(error) {
        if (error === issueDetailsController.errors.NOT_FOUND) {
            return res.status(404).send({message: issueDetailsController.errors.NOT_FOUND});
        }
        return res.status(500).send({message: error});
    }
});

reservations.get('/user/:userId', protectedRoute, adminRoute, async (req: AuthRequest, res) => {
    const userId = req?.params?.userId;

    if (!userId) {
        return res.status(400).send({message: issueDetailsController.errors.MISSING_DETAILS});
    }

    const reservations = await issueDetailsController.getReservations(userId);

    return res.status(200).json(reservations);
});
