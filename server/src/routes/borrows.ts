import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { protectedRoute } from '../utils/helpers.js';
import { AuthRequest } from '../utils/typescript.js';
import IssueDetailsController from '../controllers/issue-details.js';
import BookController from '../controllers/books.js';


// The router will be added as a middleware and will take control of requests starting with /borrows.
const borrows = Router({mergeParams: true});
export default borrows;

const issueDetailsController = new IssueDetailsController();
const bookController = new BookController();

/**
 * Routes
 *
 * POST /borrow/:bookId/:userId: Creates a new borrowed book for a user
 * GET /borrow: Returns all borrowed books for the logged in user
 * POST /borrow/:bookId/:userId/return: Returns a borrowed book for the logged in user
 * GET /borrow/history: Returns the history of borrowed books for the logged in user
 *
 */

borrows.post('/:bookId/:userId/return', protectedRoute, async (req: AuthRequest, res) => {
    // curl command to his this endpoint
    // curl -X POST
    if (!req?.auth?.isAdmin) return res.status(403).json({ message: issueDetailsController.errors.ADMIN_ONLY });
    const userId = req?.params?.userId;
    const bookId = req?.params?.bookId;

    if (!userId || !bookId) {
        return res.status(400).json({ message: issueDetailsController.errors.MISSING_DETAILS });
    }

    try {
        const result = await issueDetailsController.returnBook(userId, bookId);
        return res.status(200).json(result);
    } catch(error) {
        return res.status(500).json({ message: error.message });
    }
});

borrows.post('/:bookId/:userId', protectedRoute, async (req: AuthRequest, res) => {
    // curl command to his this endpoint
    // curl -X POST http://localhost:5000/borrow/0195153448/64d4c7505bd483105c48991d -H "Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGQ0Yzk2NGYwZDA1NmVhNmJmMGYzZDgiLCJuYW1lIjoiT2xkU2Nob29sIEFsbGlnYXRvciIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY5MTY2Njc4OCwiZXhwIjoxNzIzMjAyNzg4fQ.0ycGXmrPBBJC9f1_nhJ7Ypi0C1DjzcZ6NpQVvpDAnJM'"
    if (!req?.auth?.isAdmin) return res.status(403).json({ message: issueDetailsController.errors.ADMIN_ONLY });
    const userId = req?.params?.userId;

    const user = {
        _id: new ObjectId(userId),
        name: req?.auth?.name
    };
    const bookId = req?.params?.bookId;

    try {
        const result = await issueDetailsController.borrowBook(bookId, user);
        return res.status(201).json(result);
    } catch (error) {
        if (error.message == bookController.errors.NOT_FOUND) return res.status(404).json({ message: error.message });
        if (error.message == bookController.errors.NOT_AVAILABLE) return res.status(400).json({ message: error.message });
        if (error.message == issueDetailsController.errors.ALREADY_BOOKED) return res.status(400).json({ message: error.message });
        return res.status(500).json({ message: error.message });
    }
});

borrows.get('/', protectedRoute, async (req: AuthRequest, res) => {
    const userId = req?.auth?.sub;

    try {
        const result = await issueDetailsController.getBorrows(userId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

borrows.get('/history', protectedRoute, async (req: AuthRequest, res) => {
    const userId = req?.auth?.sub;

    try {
        const result = await issueDetailsController.getBorrowedHistory(userId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});