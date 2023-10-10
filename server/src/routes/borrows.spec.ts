import request from 'supertest';
import assert from 'assert';
import { Book } from '../models/book';
import { getBaseUrl, users, books } from '../utils/testing-shared.js';
import { cleanDatabase } from '../utils/testing-shared.js';
import IssueDetailsController from '../controllers/issue-details.js';

const adminJWT = users.admin.jwt;
const userJWT = users.user1.jwt;

const issueDetailsController = new IssueDetailsController();

describe('Borrows API', () => {
    const book: Book = books.sample;
    const unavailableBook: Book = books.notAvailable;
    const bookWithOneCopy: Book = books.oneCopy;

    before(async () => {
        await cleanDatabase();

        await request(getBaseUrl())
            .post('/books')
            .set('Authorization', `Bearer ${adminJWT}`)
            .send(book);
        await request(getBaseUrl())
            .post('/books')
            .set('Authorization', `Bearer ${adminJWT}`)
            .send(unavailableBook);
        await request(getBaseUrl())
            .post('/books')
            .set('Authorization', `Bearer ${adminJWT}`)
            .send(bookWithOneCopy);
    });

    after(async () => {
        await cleanDatabase();
    });

    it('Should let a user with a reservation borrow a book', async () => {
        // Reserve a book
        await request(getBaseUrl())
            .post(`/reservations/${book._id}`)
            .set('Authorization', `Bearer ${userJWT}`)
            .expect(201);

        // Borrow the same book
        await request(getBaseUrl())
            .post(`/borrow/${book._id}/${users.user1._id}`)
            .set('Authorization', `Bearer ${adminJWT}`)
            .expect(201);

        // Check the there is one less available book
        const response = await request(getBaseUrl())
            .get(`/books/${book._id}`)
            .set('Authorization', `Bearer ${userJWT}`)
            .expect(200);
        const avail = response.body.available;
        const expectedAvail = book.available - 1;
        assert(avail == expectedAvail, 'There should be one less available book');

        // Check that the reservation is deleted
        const reservationResponse = await request(getBaseUrl())
            .get(`/reservations/${users.user1._id}R${book._id}`)
            .set('Authorization', `Bearer ${userJWT}`)
            .expect(404);
        assert(reservationResponse?.body?.message === issueDetailsController.errors.NOT_FOUND, 'The reservation should be deleted');

        // Check that the user has the book in their borrowed books
        const borrowedBooks = await request(getBaseUrl())
            .get('/borrow')
            .set('Authorization', `Bearer ${userJWT}`)
            .expect(200);

        assert(borrowedBooks?.body?.length === 1, 'The user should have one borrowed book');
        assert(borrowedBooks?.body?.[0]?.book._id === book._id, 'The user should have the borrowed book with matching id');
    });

    it('Should let a user return a book', async () => {
        // Return the book
        await request(getBaseUrl())
            .post(`/borrow/${book._id}/${users.user1._id}/return`)
            .set('Authorization', `Bearer ${adminJWT}`)
            .expect(200);

        // Check that the book is available
        const response = await request(getBaseUrl())
            .get(`/books/${book._id}`)
            .set('Authorization', `Bearer ${userJWT}`)
            .expect(200);
        assert(response?.body?.available === book.available, 'There should be one more available book');

        // // Check that the user does not have the book in their borrowed books
        const borrowedBooks = await request(getBaseUrl())
            .get('/borrow')
            .set('Authorization', `Bearer ${userJWT}`)
            .expect(200);
        assert(borrowedBooks?.body?.length === 0, 'The user should not have any borrowed books');

        // // Check that the user has the book in their history of borrowed books
        const borrowedHistory = await request(getBaseUrl())
            .get('/borrow/history')
            .set('Authorization', `Bearer ${userJWT}`)
            .expect(200);
        assert(borrowedHistory?.body?.length === 1, 'The user should have one borrowed book in their history');
    });

    it('Should let a user without a reservation borrow a book', async () => {
        // Borrow a book
        await request(getBaseUrl())
            .post(`/borrow/${bookWithOneCopy._id}/${users.user1._id}`)
            .set('Authorization', `Bearer ${adminJWT}`)
            .expect(201);

        // Check the there is one less available book
        const finalBook = await request(getBaseUrl())
            .get(`/books/${bookWithOneCopy._id}`)
            .set('Authorization', `Bearer ${userJWT}`)
            .expect(200);
        assert(finalBook?.body?.available === 0, 'There should be one less available book');

        // Check that the user has the book in their borrowed books
        const borrowedBooks = await request(getBaseUrl())
            .get('/borrow')
            .set('Authorization', `Bearer ${userJWT}`)
            .expect(200);
        assert(borrowedBooks?.body?.length === 1, 'The user should have one borrowed book');
    });

    it('Should let a user renew a borrowed book if they already borrowed the book', async () => {
        // Borrow a book
        await request(getBaseUrl())
            .post(`/borrow/${book._id}/${users.user1._id}`)
            .set('Authorization', `Bearer ${adminJWT}`)
            .expect(201);

        // Borrow the same book
        await request(getBaseUrl())
            .post(`/borrow/${book._id}/${users.user1._id}`)
            .set('Authorization', `Bearer ${adminJWT}`)
            .expect(201);
    });

    it('Should not let a user borrow and reserve more than 10 books', async () => {
        // Borrow 5 books

        // Reserve 5 books

        // Borrow another book

        // Expect error

    });

    it('Should not let a user return a book they have not borrowed', async () => {
        // Borrow a book

        // Return a different book

        // Expect error
    });

    it('Should let an admin return a book', async () => {
        // Borrow a book as a user

        // Return the book as an admin

        // Check that the book is available

        // Check that the user does not have the book in their borrowed books
    });

    it('Should let a user see their borrowed books', async () => {
        // Borrow a book

        // Check that the user has the book in their borrowed books
    });

    it('Should let a user see their history of borrowed books', async () => {
        // Borrow a book

        // Return the book

        // Check that the user has the book in their history of borrowed books
    });

});