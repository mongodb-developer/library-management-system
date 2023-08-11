import request from 'supertest';
import assert from 'assert';
import { Book } from '../models/book';
import { baseUrl, users, books } from '../utils/testingShared.js';

const adminJWT = users.admin.jwt;
const userJWT = users.user1.jwt;

describe('Books API', () => {
    const book: Book = books.sample;

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

        assert(createBookResponse?.body?.message?.includes('Created a new book with id'), 'Book was not created');

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

        assert(updateReponse?.body?.message?.includes('Updated book with id'), 'Book was not updated');

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

        assert(response?.body?.message?.includes('Removed book with id'), 'Book was not deleted');

        const getBookReponse = await request(baseUrl)
            .get(`/books/${book._id}`)
            .expect(404);

        assert(getBookReponse?.body?.message?.includes(`Book with id ${book._id} was not found`), 'Book was not deleted');
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

        assert(response?.body?.message?.includes(`Book with id ${book._id} was not found`), 'Invalid response for 404');
    });

    it('Should return 400 for missing body', async () => {
        const response = await request(baseUrl)
            .post('/books')
            .set('Authorization', `Bearer ${adminJWT}`)
            .expect(400);

        assert(response?.body?.message?.includes('Book details are missing'), 'Invalid response for 400');
    });

    it('Should return 400 for missing update data', async () => {
        const response = await request(baseUrl)
            .put(`/books/${book._id}`)
            .set('Authorization', `Bearer ${adminJWT}`)
            .expect(400);

        assert(response?.body?.message?.includes('Book details are missing'), 'Invalid response for 400');
    });
});
