import request from 'supertest';
import assert from 'assert';
import { ObjectId } from 'mongodb';
import { getBaseUrl } from '../utils/testing-shared.js';
import { collections } from '../database.js';

describe('Authors API', () => {
    const author = {
        _id: new ObjectId(),
        name: 'J. R. R. Tolkien',
        sanitizedName: 'j-r-r-tolkien',
        aliases: ['Tolkien', 'John Ronald Reuel Tolkien'],
        bio: 'John Ronald Reuel Tolkien was an English writer, poet, philologist, and academic. He was the author of the high fantasy works The Hobbit and The Lord of the Rings.',
        books: ['9780261103665']
    };

    before(async () => {
        await collections.authors.insertOne(author);
    });

    after(async () => {
        await collections.authors.deleteOne({ _id: author._id });
    });

    it('Should retrieve authors by id', async () => {
        const response = await request(getBaseUrl())
            .get(`/authors/${author._id}`)
            .expect(200)
            .expect('Content-Type', /json/);

        assert(response?.body?.name === author.name, 'Author was not retrieved');
        assert(response?.body?.books?.length === 1, 'Author books were not retrieved');
    });
});
