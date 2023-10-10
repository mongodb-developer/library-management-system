import request from 'supertest';
import assert from 'assert';
import { ObjectId } from 'mongodb';
import { getBaseUrl } from '../utils/testing-shared.js';
import { collections } from '../database.js';

describe('Authors API', () => {
    const book = {
        _id: '9780261103665',
        title: 'Silmarillion',
        year: 1977,
        authors: [
            {
                _id: new ObjectId('5f9d88d3ee5e5e4c9ef7f1b0'),
                name: 'J. R. R. Tolkien'
            }
        ],
        totalInventory: 1,
        available: 1,
        reviews: [],
        attributes: [],
    };

    const author = {
        _id: new ObjectId('5f9d88d3ee5e5e4c9ef7f1b0'),
        name: 'J. R. R. Tolkien',
        sanitizedName: 'j-r-r-tolkien',
        aliases: ['Tolkien', 'John Ronald Reuel Tolkien'],
        bio: 'John Ronald Reuel Tolkien was an English writer, poet, philologist, and academic. He was the author of the high fantasy works The Hobbit and The Lord of the Rings.',
        books: [ '9780261103665' ]
    };

    before(async () => {
        await collections.books.insertOne(book);
        await collections.authors.insertOne(author);
    });

    after(async () => {
        await collections.books.deleteOne({ _id: book._id });
        await collections.authors.deleteOne({ _id: author._id });
    });

    it('Should retrieve authors by id', async () => {
        const response = await request(getBaseUrl())
            .get(`/authors/${author._id}`)
            .expect(200)
            .expect('Content-Type', /json/);

        assert(response?.body?.name === author.name, 'Author was not retrieved');

        const books = response?.body?.books;
        assert(books?.length === 1, 'Author books were not retrieved');
        assert(!books[0]._id, 'Author book _id was in the response');
        assert(books[0].isbn === book._id, 'Author book ISBN was not in the response');
        assert(books[0].title === book.title, 'Author book title was not in the response');
    });
});
