import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { Review } from '../models/review.js';
import { collections } from '../database.js';
import { IAuthRequest } from '../utils/typescript.js';
import { protectedRoute } from '../utils/helpers.js';

// The router will be added as a middleware and will take control of requests starting with /books/:bookId/reviews.
const reviews = Router({mergeParams: true});
export default reviews;

reviews.get('/', async (req: IAuthRequest, res) => {
    const bookId = req?.params?.bookId;

    if (!bookId) {
        return res.status(400).send({message: 'Book id is missing'});
    }

    try {
        const reviews = await collections?.reviews?.find({ bookId: bookId }).toArray();
        return res.json(reviews);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send({message: `Failed to get reviews for book with id ${bookId}`});
    }
});

reviews.post('/', protectedRoute, async (req: IAuthRequest, res) => {
    const bookId = req?.params?.bookId;
    const reviewBody = req?.body;
    const userName = req?.auth?.name;

    if (!bookId) {
        return res.status(400).send({message: 'Book id is missing'});
    }

    if (!reviewBody) {
        return res.status(400).send({message: 'Review details are missing'});
    }

    if (!userName) {
        return res.status(400).send({message: 'User name is missing'});
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
        return res.status(201).send({
            message: `Created a new review with id ${insertResult.insertedId}`,
            insertedId: insertResult.insertedId
        });
    }

    return res.status(500).send({message: 'Failed to create a new review'});
});

reviews.get('/:reviewId', async (req: IAuthRequest, res) => {
    const bookId = req?.params?.bookId;
    const reviewId = req?.params?.reviewId;

    if (!bookId) {
        return res.status(400).send({message: 'Book id is missing'});
    }

    if (!reviewId) {
        return res.status(400).send({message: 'Review id is missing'});
    }

    const review = await collections?.reviews?.findOne({ _id: new ObjectId(reviewId), bookId: bookId });


    if (review) {
        return res.json(review);
    }

    return res.status(404).send({message: `Review with id ${reviewId} was not found`});
});
