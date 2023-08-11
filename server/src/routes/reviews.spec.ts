import request from 'supertest';
import assert from 'assert';
import { Book } from '../models/book';
import { baseUrl, users, books } from '../utils/testingShared.js';

const adminJWT = users.admin.jwt;
const userJWT = users.user1.jwt;

describe('Reviews API', () => {
    const book: Book = books.sample;

    const review = {
        text: 'Great book!'
    };

    let reviewId;

    before(async () => {
        await request(baseUrl)
            .delete(`/books/${book._id}`)
            .set('Authorization', `Bearer ${adminJWT}`);
        await request(baseUrl)
            .post('/books')
            .set('Authorization', `Bearer ${adminJWT}`)
            .send(book);
    });

    after(async () => {
        await request(baseUrl)
            .delete(`/books/${book._id}`)
            .set('Authorization', `Bearer ${adminJWT}`);
    });

    it('Should let me add reviews', async () => {
        const createBookResponse = await request(baseUrl)
            .post(`/books/${book._id}/reviews`)
            .set('Authorization', `Bearer ${userJWT}`)
            .send(review)
            .expect(201);

        assert(createBookResponse?.body?.message?.includes('Created a new review'), 'Review was not created');

        const getBooksResponse = await request(baseUrl)
            .get(`/books/${book._id}`)
            .expect(200)
            .expect('Content-Type', /json/);

        assert(getBooksResponse?.body?.reviews?.length === 2, 'There should be 2 reviews');
    });

    it('Should not have more than 5 reviews', async () => {
        for (let i = 0; i < 10; i++) {
            const result = await request(baseUrl)
                .post(`/books/${book._id}/reviews`)
                .set('Authorization', `Bearer ${userJWT}`)
                .send(review)
                .expect(201);
            reviewId = result?.body?.insertedId;
        }

        const getBooksResponse = await request(baseUrl)
            .get(`/books/${book._id}`)
            .expect(200)
            .expect('Content-Type', /json/);

        assert(getBooksResponse?.body?.reviews?.length === 5, 'There should be 5 reviews');
    });

    it('Should let me see all reviews for a given book', async () => {
        const reviewResponse = await request(baseUrl)
            .get(`/books/${book._id}/reviews`)
            .expect(200);

        assert(reviewResponse?.body?.length >= 10, 'There should be more than 10 reviews');
    });

    it('Should not let me add reviews if I am not logged in', async () => {
        await request(baseUrl)
            .post('/books/9780075536321/reviews')
            .send(review)
            .expect(401);
    });

    it('Should let me see a single review by id', async () => {
        const reviewResponse = await request(baseUrl)
            .get(`/books/${book._id}/reviews/${reviewId}`)
            .expect(200);

        assert(reviewResponse?.body?.text === review.text, 'Review text should match');
    });

    it('Should return 404 if the review doesn\'t exist', async () => {
        await request(baseUrl)
            .get(`/books/${book._id}/reviews/123456789012`)
            .expect(404);
    });

    it('Should prevent a user from borrowing and reserving more than 10 books', async () => {
        // TODO
    });
});
