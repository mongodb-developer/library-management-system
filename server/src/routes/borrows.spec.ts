import request from 'supertest';
// import assert from 'assert';
import { ObjectId } from 'mongodb';
import { Book } from '../models/book';

const baseUrl = 'http://localhost:5000';

const adminJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGQ0Yzk2NGYwZDA1NmVhNmJmMGYzZDgiLCJuYW1lIjoiT2xkU2Nob29sIEFsbGlnYXRvciIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY5MTY2Njc4OCwiZXhwIjoxNzIzMjAyNzg4fQ.0ycGXmrPBBJC9f1_nhJ7Ypi0C1DjzcZ6NpQVvpDAnJM';
// const userJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGQ0Yzc1MDViZDQ4MzEwNWM0ODk5MWQiLCJuYW1lIjoiUm93ZHkgSHllbmEiLCJpYXQiOjE2OTE2NjY3ODgsImV4cCI6MTcyMzIwMjc4OH0.YCFLMDhF4R009QT3bOy_H90ocgpKRhIMdbtpOvO-s-c';

describe('Borrows API', () => {
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