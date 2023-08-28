import { Router } from 'express';
import { Request as AuthRequest } from 'express-jwt';
import { protectedRoute } from '../utils/middlewares.js';
import BookController from '../controllers/books.js';
import ReviewsController from '../controllers/reviews.js';

// The router will be added as a middleware and will take control of requests starting with /books/:bookId/reviews.
const reviews = Router({mergeParams: true});
export default reviews;

const booksController = new BookController();
const reviewsController = new ReviewsController();

reviews.get('/', async (req: AuthRequest, res) => {
    const bookId = req?.params?.bookId;

    if (!bookId) {
        return res.status(400).send({message: booksController.errors.BOOK_ID_MISSING});
    }

    try {
        const reviews = await reviewsController.getReviews(bookId);
        return res.json(reviews);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send({message: reviewsController.errors.UNKNOWN_ERROR});
    }
});

reviews.post('/', protectedRoute, async (req: AuthRequest, res) => {
    const bookId = req?.params?.bookId;
    const reviewBody = req?.body;
    const userName = req?.auth?.name;

    if (!bookId) {
        return res.status(400).send({message: booksController.errors.BOOK_ID_MISSING});
    }

    if (!reviewBody) {
        return res.status(400).send({message: reviewsController.errors.DETAILS_MISSING});
    }

    try {
        const { insertResult, updateResult } = await reviewsController.createReview(bookId, reviewBody, userName);
        return res.status(201).send({
            message: reviewsController.success.CREATED,
            insertResult,
            updateResult
        });
    } catch (error) {
        return res.status(500).send({message: reviewsController.errors.UNKNOWN_ERROR});
    }
});

reviews.get('/:reviewId', async (req: AuthRequest, res) => {
    const bookId = req?.params?.bookId;
    const reviewId = req?.params?.reviewId;

    if (!bookId) {
        return res.status(400).send({message: booksController.errors.BOOK_ID_MISSING});
    }

    if (!reviewId) {
        return res.status(400).send({message: reviewsController.errors.REVIEW_ID_MISSING});
    }

    try {
        const review = await reviewsController.getReview(bookId, reviewId);
        if (review) {
            return res.json(review);
        }

        return res.status(404).send({message: reviewsController.errors.NOT_FOUND});
    } catch (error) {
        return res.status(500).send({message: reviewsController.errors.UNKNOWN_ERROR});
    }
});
