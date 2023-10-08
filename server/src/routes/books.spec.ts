import request from 'supertest';
import assert from 'assert';
import { users, books, getBaseUrl, cleanDatabase } from '../utils/testing-shared.js';
import BookController from '../controllers/books.js';

const adminJWT = users.admin.jwt;
const userJWT = users.user1.jwt;

const bookController = new BookController();

describe('Books API', () => {
    const book = books.sample;

    before(async () => {
        await cleanDatabase();
    });

    after(async () => {
        await cleanDatabase();
    });

    it('Should persist documents for admins', async () => {
        const createBookResponse = await request(getBaseUrl())
            .post('/books')
            .set('Authorization', `Bearer ${adminJWT}`)
            .send(book)
            .expect(201);

        assert(
            createBookResponse?.body?.message?.includes(bookController.success.CREATED),
            'Book was not created'
        );

        const getBooksResponse = await request(getBaseUrl())
            .get(`/books/${book._id}`)
            .expect(200)
            .expect('Content-Type', /json/);

        assert(getBooksResponse?.body?.title === book.title, 'Book was not persisted');
    });

    it('Should not persist documents for users', async () => {
        await request(getBaseUrl())
            .post('/books')
            .set('Authorization', `Bearer ${userJWT}`)
            .send(book)
            .expect(403);
    });

    it('Should retrieve documents', async () => {
        const response = await request(getBaseUrl())
            .get(`/books/${book._id}`)
            .expect(200)
            .expect('Content-Type', /json/);

        assert(response?.body?.title === book.title, 'Book was not retrieved');
    });

    it('Should update documents for admins', async () => {
        const updateReponse = await request(getBaseUrl())
            .put(`/books/${book._id}`)
            .set('Authorization', `Bearer ${adminJWT}`)
            .send({
                ...book,
                title: 'War and Peace',
            })
            .expect(200);

        assert(updateReponse?.body?.message?.includes(bookController.success.UPDATED), 'Book was not updated');

        const getResponse = await request(getBaseUrl())
            .get(`/books/${book._id}`)
            .expect(200)
            .expect('Content-Type', /json/);

        assert(getResponse?.body?.title === 'War and Peace', 'Book was not updated');
    });

    it('Should not let users update books', async () => {
        await request(getBaseUrl())
            .put(`/books/${book._id}`)
            .set('Authorization', `Bearer ${userJWT}`)
            .send({
                ...book,
                title: 'War and Peace',
            })
            .expect(403);
    });

    it('Should delete documents for admins', async () => {
        const response = await request(getBaseUrl())
            .delete(`/books/${book._id}`)
            .set('Authorization', `Bearer ${adminJWT}`)
            .expect(202);

        assert(response?.body?.message?.includes(bookController.success.DELETED), 'Book was not deleted');

        const getBookReponse = await request(getBaseUrl())
            .get(`/books/${book._id}`)
            .expect(404);

        assert(getBookReponse?.body?.message?.includes(bookController.errors.NOT_FOUND), 'Book was not deleted');
    });

    it('Should not let users delete books; only admins', async () => {
        await request(getBaseUrl())
            .delete(`/books/${book._id}`)
            .set('Authorization', `Bearer ${userJWT}`)
            .expect(403);
    });

    it('Should return 404 for non-existent documents', async () => {
        const response = await request(getBaseUrl())
            .get('/books/invalid')
            .expect(404);

        assert(response?.body?.message?.includes(bookController.errors.NOT_FOUND), 'Invalid response for 404');
    });

    it('Should return 400 for missing body', async () => {
        const response = await request(getBaseUrl())
            .post('/books')
            .set('Authorization', `Bearer ${adminJWT}`)
            .expect(400);

        assert(response?.body?.message?.includes(bookController.errors.DETAILS_MISSING), 'Invalid response for 400');
    });

    it('Should return 400 for missing update data', async () => {
        const response = await request(getBaseUrl())
            .put(`/books/${book._id}`)
            .set('Authorization', `Bearer ${adminJWT}`)
            .expect(400);

        assert(response?.body?.message?.includes(bookController.errors.DETAILS_MISSING), 'Invalid response for 400');
    });
});
