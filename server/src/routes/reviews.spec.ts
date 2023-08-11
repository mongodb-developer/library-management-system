import request from 'supertest';
import assert from 'assert';
import { ObjectId } from 'mongodb';
import { Book } from '../models/book';

const baseUrl = 'http://localhost:5000';

const adminJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGQ0Yzk2NGYwZDA1NmVhNmJmMGYzZDgiLCJuYW1lIjoiT2xkU2Nob29sIEFsbGlnYXRvciIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY5MTY2Njc4OCwiZXhwIjoxNzIzMjAyNzg4fQ.0ycGXmrPBBJC9f1_nhJ7Ypi0C1DjzcZ6NpQVvpDAnJM';
const userJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGQ0Yzc1MDViZDQ4MzEwNWM0ODk5MWQiLCJuYW1lIjoiUm93ZHkgSHllbmEiLCJpYXQiOjE2OTE2NjY3ODgsImV4cCI6MTcyMzIwMjc4OH0.YCFLMDhF4R009QT3bOy_H90ocgpKRhIMdbtpOvO-s-c';

describe('Reviews API', () => {
    const book: Book = {
        _id: '9780075536321',
        title: 'Anna Karenina',
        authors: [{
            _id: new ObjectId(),
            name: 'Leo Tolstoy',
        }],
        cover: 'https://m.media-amazon.com/images/I/712ZWjY8VWL._AC_UF1000,1000_QL80_.jpg',
        genres: ['Fiction'],
        year: 1877,
        pages: 864,
        synopsis: 'Anna Karenina tells of the doomed love affair between the sensuous and rebellious Anna and the dashing officer, Count Vronsky. Tragedy unfolds as Anna rejects her passionless marriage and must endure the hypocrisies of society. Set against a vast and richly textured canvas of nineteenth-century Russia, the novel\'s seven major characters create a dynamic imbalance, playing out the contrasts of city and country life and all the variations on love and family happiness.',
        totalInventory: 10,
        available: 10,
        attributes: [{
            key: 'language',
            value: 'English',
        }],
        reviews: [{
            text: 'A masterpiece of world literature.',
            name: 'Amazon Customer',
            rating: 5,
            timestamp: 1600000000000,
        }],
    };

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
