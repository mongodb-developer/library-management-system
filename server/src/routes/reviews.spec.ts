import request from 'supertest';
import assert from 'assert';
import { getBaseUrl, users, books, cleanDatabase } from '../utils/testing-shared.js';
import ReviewsController from '../controllers/reviews.js';

const adminJWT = users.admin.jwt;
const userJWT = users.user1.jwt;

const reviewsController = new ReviewsController();

describe('Reviews API', () => {
    const book = books.sample;

    const review = {
        text: 'Great book!'
    };

    before(async () => {
        await cleanDatabase();
        await request(getBaseUrl())
            .post('/books')
            .set('Authorization', `Bearer ${adminJWT}`)
            .send(book);
    });

    after(async () => {
        await cleanDatabase();
    });

    it('Should let me add reviews', async () => {
        const createBookResponse = await request(getBaseUrl())
            .post(`/books/${book._id}/reviews`)
            .set('Authorization', `Bearer ${userJWT}`)
            .send(review)
            .expect(201);

        assert(createBookResponse?.body?.message?.includes(reviewsController.success.CREATED), 'Review was not created');

        const getBooksResponse = await request(getBaseUrl())
            .get(`/books/${book._id}`)
            .expect(200)
            .expect('Content-Type', /json/);

        assert(getBooksResponse?.body?.reviews?.length === 2, 'There should be 2 reviews');
    });

    it('Should not have more than 5 reviews', async () => {
        for (let i = 0; i < 10; i++) {
            await request(getBaseUrl())
                .post(`/books/${book._id}/reviews`)
                .set('Authorization', `Bearer ${userJWT}`)
                .send(review)
                .expect(201);

        }

        const getBooksResponse = await request(getBaseUrl())
            .get(`/books/${book._id}`)
            .expect(200)
            .expect('Content-Type', /json/);

        assert(getBooksResponse?.body?.reviews?.length === 5, 'There should be 5 reviews');
    });

    it('Should let me see all reviews for a given book', async () => {
        const reviewResponse = await request(getBaseUrl())
            .get(`/books/${book._id}/reviews`)
            .expect(200);

        assert(reviewResponse?.body?.length >= 10, 'There should be more than 10 reviews');
    });

    it('Should not let me add reviews if I am not logged in', async () => {
        await request(getBaseUrl())
            .post(`/books/${book._id}/reviews`)
            .send(review)
            .expect(401);
    });

    it('Should let me see a single review by id', async () => {
        const insertResponse = await request(getBaseUrl())
            .post(`/books/${book._id}/reviews`)
            .set('Authorization', `Bearer ${userJWT}`)
            .send(review);

        const reviewId = insertResponse?.body?.insertResult?.insertedId;

        const reviewResponse = await request(getBaseUrl())
            .get(`/books/${book._id}/reviews/${reviewId}`)
            .expect(200);

        assert(reviewResponse?.body?.text === review.text, 'Review text should match');
    });

    it('Should return 404 if the review doesn\'t exist', async () => {
        await request(getBaseUrl())
            .get(`/books/${book._id}/reviews/123456789012`)
            .expect(404);
    });
});
