import { ObjectId } from 'mongodb';
import { Author } from '../models/author';
import { collections } from '../database.js';

export class AuthorController {
    errors = {
        NOT_FOUND: 'Author not found',
        AUTHOR_ID_MISSING: 'Author id is missing'
    };

    public async getAuthor(authorId: string): Promise<Author> {
        const author = await collections?.authors?.findOne(
            {
                _id: new ObjectId(authorId)
            });

        return author;
    }
}
