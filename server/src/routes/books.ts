import { Router } from 'express';
import { Filter, FindOptions, ObjectId } from 'mongodb';
import { expressjwt as jwt } from 'express-jwt';
import { Book } from '../models/book.js';
import { Review } from '../models/review.js';
import { collections } from '../database.js';
import { IAuthRequest } from '../utils/typescript.js';

// The router will be added as a middleware and will take control of requests starting with /books.
const books = Router();
export default books;

const secret = process.env.SECRET || 'secret';
const protectedRoute = jwt({
    secret,
    algorithms: ['HS256']
});

books.get('/', async (req, res) => {
    let limit = parseInt(req?.query?.limit as string) || 12;

    if (limit > 100) {
        limit = 100;
    }

    const skip = parseInt(req?.query?.skip as string) || 0;
    const filter = {} as Filter<Book>;
    const project = {_id: 0} as FindOptions<Book>;

    const bookCursor = await collections?.books?.find(filter, project);
    const books = bookCursor.limit(limit).skip(skip).toArray();

    return res.json(await books);
});

books.post('/', protectedRoute, async (req: IAuthRequest, res) => {
    if (req?.auth?.isAdmin !== true) {
        return res.status(403).send('Only admins can create books');
    }

    const book = req?.body;

    if (!book || Object.keys(book).length === 0) {
        return res.status(400).send('Book details are missing');
    }

    const result = await collections?.books?.insertOne(book);

    if (result?.insertedId) {
        return res.status(201).send(`Created a new book with id ${result.insertedId}`);
    }

    return res.status(500).send('Failed to create a new book');
});

books.get('/:bookId', async (req, res) => {
    const bookId = req?.params?.bookId;

    if (!bookId) {
        return res.status(400).send('Book id is missing');
    }

    const book = await collections?.books?.findOne({ _id: bookId });

    if (book) {
        return res.json(book);
    }

    return res.status(404).send(`Book with id ${bookId} was not found`);
});

books.put('/:bookId', protectedRoute, async (req: IAuthRequest, res) => {
    if (req?.auth?.isAdmin !== true) {
        return res.status(403).send('Only admins can update books');
    }

    const bookId = req?.params?.bookId;
    const book = req?.body;

    if (!bookId) {
        return res.status(400).send('Book id is missing');
    }

    if (!book || Object.keys(book).length === 0) {
        return res.status(400).send('Book details are missing');
    }

    const result = await collections?.books?.updateOne({ _id: bookId }, { $set: book });

    if (result?.modifiedCount) {
        return res.send(`Updated book with id ${bookId}`);
    }

    return res.status(500).send(`Failed to update book with id ${bookId}`);
});

books.delete('/:bookId', protectedRoute, async (req: IAuthRequest, res) => {
    if (req?.auth?.isAdmin !== true) {
        return res.status(403).send('Only admins can delete books');
    }

    const bookId = req?.params?.bookId;

    if (!bookId) {
        return res.status(400).send('Book id is missing');
    }

    try {
        const result = await collections?.books?.deleteOne({ _id: bookId });

        if (result?.deletedCount) {
            res.status(202).send(`Removed book with id ${bookId}`);
        } else if (!result) {
            res.status(400).send(`Book with id ${bookId} does not exist`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Book with id ${bookId} was not found`);
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).send(`Failed to delete book with id ${bookId}`);
    }
});

books.get('/:bookId/reviews', async (req, res) => {
    const bookId = req?.params?.bookId;

    if (!bookId) {
        return res.status(400).send('Book id is missing');
    }

    try {
        const reviews = await collections?.reviews?.find({ bookId: bookId }).toArray();
        return res.json(reviews);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send(`Failed to get reviews for book with id ${bookId}`);
    }
});

books.post('/:bookId/reviews', protectedRoute, async (req: IAuthRequest, res) => {
    const bookId = req?.params?.bookId;
    const reviewBody = req?.body;
    const userName = req?.auth?.name;

    if (!bookId) {
        return res.status(400).send('Book id is missing');
    }

    if (!reviewBody) {
        return res.status(400).send('Review details are missing');
    }

    const review = {
        _id: null,
        text: reviewBody?.text,
        name: userName,
        rating: reviewBody?.rating,
        timestamp: (new Date()).getTime(),
        bookId
    } as Review;

    const insertResult = await collections?.reviews?.insertOne(review);

    review._id = insertResult?.insertedId;
    delete review.bookId;

    const updateResult = await collections?.books?.updateOne({ _id: bookId }, {
        $push: {
            reviews: {
                $each: [ review ],
                $sort: { timestamp: -1 },
                $slice: 5
            }
        }
    });

    if (insertResult?.insertedId && updateResult?.modifiedCount) {
        return res.status(201).send(`Created a new review with id ${insertResult.insertedId}`);
    }

    return res.status(500).send('Failed to create a new review');
});

books.get('/:bookId/reviews/:reviewId', async (req, res) => {
    const bookId = req?.params?.bookId;
    const reviewId = req?.params?.reviewId;

    if (!bookId) {
        return res.status(400).send('Book id is missing');
    }

    if (!reviewId) {
        return res.status(400).send('Review id is missing');
    }

    const review = await collections?.reviews?.findOne({ _id: new ObjectId(reviewId), bookId: bookId });


    if (review) {
        return res.json(review);
    }

    return res.status(404).send(`Review with id ${reviewId} was not found`);
});
