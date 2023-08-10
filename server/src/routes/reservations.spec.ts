import request from 'supertest';
import assert from 'assert';
import { ObjectId } from 'mongodb';
import { Book } from '../models/book';

const baseUrl = 'http://localhost:5000';

const adminJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGQ0Yzk2NGYwZDA1NmVhNmJmMGYzZDgiLCJuYW1lIjoiT2xkU2Nob29sIEFsbGlnYXRvciIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY5MTY2Njc4OCwiZXhwIjoxNzIzMjAyNzg4fQ.0ycGXmrPBBJC9f1_nhJ7Ypi0C1DjzcZ6NpQVvpDAnJM';
const userJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGQ0Yzc1MDViZDQ4MzEwNWM0ODk5MWQiLCJuYW1lIjoiUm93ZHkgSHllbmEiLCJpYXQiOjE2OTE2NjY3ODgsImV4cCI6MTcyMzIwMjc4OH0.YCFLMDhF4R009QT3bOy_H90ocgpKRhIMdbtpOvO-s-c';
const userId = '64d4c7505bd483105c48991d';

describe('Reservation API', () => {
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
        totalInventory: 1,
        available: 1,
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

    it('Should let users reserve a book', async () => {
        const createReservationResponse = await request(baseUrl)
            .post(`/reservations/${book._id}`)
            .set('Authorization', `Bearer ${userJWT}`)
            .expect(201);

        assert(createReservationResponse?.body?.message?.includes('new reservation'), 'Book was not created');

        const getBooksResponse = await request(baseUrl)
            .get(`/books/${book._id}`)
            .expect(200)
            .expect('Content-Type', /json/);

        assert(getBooksResponse?.body?.available === 0, 'Book should not be available');
    });

    it('Should return 404 if the book does not exist', async () => {
        const createReservationResponse = await request(baseUrl)
            .post('/reservations/invalid')
            .set('Authorization', `Bearer ${userJWT}`)
            .expect(404);

        assert(createReservationResponse?.body?.message?.includes('not found'), 'Book should not exist');
    });

    it('Should return 400 if the book is not available', async () => {
        const createReservationResponse = await request(baseUrl)
            .post(`/reservations/${book._id}`)
            .set('Authorization', `Bearer ${userJWT}`)
            .expect(400);

        assert(createReservationResponse?.body?.message?.includes('not available'), 'Book should not be available');
    });

    it('Should not let me reserve a book if I am not logged in', async () => {
        await request(baseUrl)
            .post('/reservations/9780075536321')
            .expect(401);
    });

    it('Should let me see my reserved books', async () => {
        const getReservationsResponse = await request(baseUrl)
            .get('/reservations')
            .set('Authorization', `Bearer ${userJWT}`)
            .expect(200);

        assert(getReservationsResponse?.body?.length === 1, 'There should be 1 reservation');
        assert(getReservationsResponse?.body?.[0]?.book?._id === book._id, 'The reservation should be for the correct book');
    });

    it('Should let the admin see a users reserved books', async () => {
        const getReservationsResponse = await request(baseUrl)
            .get(`/reservations/user/${userId}`)
            .set('Authorization', `Bearer ${adminJWT}`)
            .expect(200);

        assert(getReservationsResponse?.body?.length === 1, 'There should be 1 reservation');
        assert(getReservationsResponse?.body?.[0]?.book?._id === book._id, 'The reservation should be for the correct book');
    });

    it('Should let me cancel a reservation', async () => {
        const originalBook = await request(baseUrl)
            .get(`/books/${book._id}`)
            .expect(200);

        const cancelReservationResponse = await request(baseUrl)
            .delete(`/reservations/${book._id}`)
            .set('Authorization', `Bearer ${userJWT}`)
            .expect(200);

        assert(cancelReservationResponse?.body?.message?.includes('Deleted'), 'Reservation should be cancelled');

        const newBook = await request(baseUrl)
            .get(`/books/${book._id}`)
            .expect(200);

        assert(newBook?.body?.available === originalBook?.body?.available + 1, 'Book should be available again');
    });
});
