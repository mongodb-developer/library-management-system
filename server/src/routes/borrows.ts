import { Router } from 'express';
import { protectedRoute, adminRoute } from '../utils/middlewares.js';
import { Request as AuthRequest } from 'express-jwt';
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
 * GET /borrow/page: Returns a page of borrowed books
 * POST /borrow/:bookId/:userId: Creates a new borrowed book for a user
 * GET /borrow: Returns all borrowed books for the logged in user
 * POST /borrow/:bookId/:userId/return: Returns a borrowed book
 * GET /borrow/history: Returns the history of borrowed books for the logged in user
 *
 */

borrows.get('/page', protectedRoute, adminRoute, async (req: AuthRequest, res) => {
    const limit = parseInt(req?.query?.limit as string) || undefined;
    const skip = parseInt(req?.query?.skip as string) || undefined;

    const borrowedBooks = await issueDetailsController.getPagedBorrows(limit, skip);

    return res.status(200).json(borrowedBooks);
});

borrows.post('/:bookId/:userId/return', protectedRoute, adminRoute, async (req: AuthRequest, res) => {
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

borrows.post('/:bookId/:userId', protectedRoute, adminRoute, async (req: AuthRequest, res) => {
    const bookId = req?.params?.bookId;
    const userId = req?.params?.userId;

    try {
        const result = await issueDetailsController.borrowBook(bookId, userId);
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