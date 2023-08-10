import request from 'supertest';
import assert from 'assert';
import { ObjectId } from 'mongodb';
import { Book } from '../models/book';

const baseUrl = 'http://localhost:5000';

const adminJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGQ0Yzk2NGYwZDA1NmVhNmJmMGYzZDgiLCJuYW1lIjoiT2xkU2Nob29sIEFsbGlnYXRvciIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY5MTY2Njc4OCwiZXhwIjoxNzIzMjAyNzg4fQ.0ycGXmrPBBJC9f1_nhJ7Ypi0C1DjzcZ6NpQVvpDAnJM';
const userJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGQ0Yzc1MDViZDQ4MzEwNWM0ODk5MWQiLCJuYW1lIjoiUm93ZHkgSHllbmEiLCJpYXQiOjE2OTE2NjY3ODgsImV4cCI6MTcyMzIwMjc4OH0.YCFLMDhF4R009QT3bOy_H90ocgpKRhIMdbtpOvO-s-c';

describe('Books API', () => {
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

    before(async () => {
        await request(baseUrl)
            .delete(`/books/${book._id}`)
            .set('Authorization', `Bearer ${adminJWT}`);
    });

    after(async () => {
        await request(baseUrl)
            .delete(`/books/${book._id}`)
            .set('Authorization', `Bearer ${adminJWT}`);
    });

    it('Should persist documents for admins', async () => {
        const createBookResponse = await request(baseUrl)
            .post('/books')
            .set('Authorization', `Bearer ${adminJWT}`)
            .send(book)
            .expect(201);

        assert(createBookResponse?.text?.includes('Created a new book with id'), 'Book was not created');

        const getBooksResponse = await request(baseUrl)
            .get(`/books/${book._id}`)
            .expect(200)
            .expect('Content-Type', /json/);

        assert(getBooksResponse?.body?.title === book.title, 'Book was not persisted');
    });

    it('Should not persist documents for users', async () => {
        await request(baseUrl)
            .post('/books')
            .set('Authorization', `Bearer ${userJWT}`)
            .send(book)
            .expect(403);
    });

    it('Should retrieve documents', async () => {
        const response = await request(baseUrl)
            .get(`/books/${book._id}`)
            .expect(200)
            .expect('Content-Type', /json/);

        assert(response?.body?.title === book.title, 'Book was not retrieved');
    });

    it('Should update documents for admins', async () => {
        const updateReponse = await request(baseUrl)
            .put(`/books/${book._id}`)
            .set('Authorization', `Bearer ${adminJWT}`)
            .send({
                ...book,
                title: 'War and Peace',
            })
            .expect(200);

        assert(updateReponse?.text?.includes('Updated book with id'), 'Book was not updated');

        const getResponse = await request(baseUrl)
            .get(`/books/${book._id}`)
            .expect(200)
            .expect('Content-Type', /json/);

        assert(getResponse?.body?.title === 'War and Peace', 'Book was not updated');
    });

    it('Should not let users update books', async () => {
        await request(baseUrl)
            .put(`/books/${book._id}`)
            .set('Authorization', `Bearer ${userJWT}`)
            .send({
                ...book,
                title: 'War and Peace',
            })
            .expect(403);
    });

    it('Should delete documents for admins', async () => {
        const response = await request(baseUrl)
            .delete(`/books/${book._id}`)
            .set('Authorization', `Bearer ${adminJWT}`)
            .expect(202);

        assert(response?.text?.includes('Removed book with id'), 'Book was not deleted');

        const getBookReponse = await request(baseUrl)
            .get(`/books/${book._id}`)
            .expect(404);

        assert(getBookReponse?.text?.includes(`Book with id ${book._id} was not found`), 'Book was not deleted');
    });

    it('Should not let users delete books; only admins', async () => {
        await request(baseUrl)
            .delete(`/books/${book._id}`)
            .set('Authorization', `Bearer ${userJWT}`)
            .expect(403);
    });

    it('Should return 404 for non-existent documents', async () => {
        const response = await request(baseUrl)
            .get(`/books/${book._id}`)
            .expect(404);

        assert(response?.text?.includes(`Book with id ${book._id} was not found`), 'Invalid response for 404');
    });

    it('Should return 400 for missing body', async () => {
        const response = await request(baseUrl)
            .post('/books')
            .set('Authorization', `Bearer ${adminJWT}`)
            .expect(400);

        assert(response?.text?.includes('Book details are missing'), 'Invalid response for 400');
    });

    it('Should return 400 for missing update data', async () => {
        const response = await request(baseUrl)
            .put(`/books/${book._id}`)
            .set('Authorization', `Bearer ${adminJWT}`)
            .expect(400);

        assert(response?.text?.includes('Book details are missing'), 'Invalid response for 400');
    });
});
