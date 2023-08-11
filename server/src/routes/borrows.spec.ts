import request from 'supertest';
// import assert from 'assert';
import { Book } from '../models/book';
import { baseUrl, users, books } from '../utils/testingShared.js';

const adminJWT = users.admin.jwt;
// const userJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGQ0Yzc1MDViZDQ4MzEwNWM0ODk5MWQiLCJuYW1lIjoiUm93ZHkgSHllbmEiLCJpYXQiOjE2OTE2NjY3ODgsImV4cCI6MTcyMzIwMjc4OH0.YCFLMDhF4R009QT3bOy_H90ocgpKRhIMdbtpOvO-s-c';

describe('Borrows API', () => {
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

    it('Should let a user with a reservation borrow a book', async () => {
        // Reserve a book

        // Borrow the same book

        // Check the there is one less available book

        // Check that the reservation is deleted

        // Check that the user has the book in their borrowed books


    });

    it('Should let a user without a reservation borrow a book', async () => {
        // Borrow a book

        // Check the there is one less available book

        // Check that the user has the book in their borrowed books

    });

    it('Should not let a user borrow an unavailable book', async () => {
        // Create book with 0 available

        // Borrow the book

        // Expect error
    });

    it('Should not let a user borrow a book if they already borrowed the book', async () => {
        // Borrow a book

        // Borrow the same book

        // Expect error

    });

    it('Should not let a user borrow and reserve more than 10 books', async () => {
        // Borrow 5 books

        // Reserve 5 books

        // Borrow another book

        // Expect error

    });

    it('Should let a user return a book', async () => {
        // Borrow a book

        // Return the book

        // Check that the book is available

        // Check that the user does not have the book in their borrowed books

        // Check that the user has the book in their history of borrowed books
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