import { collections } from '../database.js';
import { Review } from '../models/review.js';
import { ObjectId, InsertOneResult, UpdateResult } from 'mongodb';

class ReviewsController {
    errors = {
        UNKNOWN_ERROR: 'An unknown error has occurred',
        DETAILS_MISSING: 'Review details are missing',
        REVIEW_ID_MISSING: 'Review id is missing',
        NOT_FOUND: 'Review not found'
    };

    success = {
        CREATED: 'Review created'
    };

    // Get all reviews for a book
    public async getReviews(bookId: string): Promise<Review[]> {
        const reviews = await collections?.reviews?.find({ bookId: bookId }).toArray();
        return reviews;
    }

    // Create a new review
    public async createReview(bookId: string, reviewBody: { text: string; rating: number; }, userName: string): Promise<{ insertResult: InsertOneResult, updateResult: UpdateResult }> {
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

        return { insertResult, updateResult };
    }

    public async getReview(bookId: string, reviewId: string): Promise<Review> {
        const review = await collections?.reviews?.findOne({ _id: new ObjectId(reviewId), bookId: bookId });
        return review;
    }
}

export default ReviewsController;