import { ObjectId } from 'mongodb';
import { AuthorResponse } from '../models/author';
import { collections } from '../database.js';

export class AuthorController {
    errors = {
        NOT_FOUND: 'Author not found',
        AUTHOR_ID_MISSING: 'Author id is missing'
    };

    public async getAuthor(authorId: string): Promise<AuthorResponse> {
        const author = await collections?.authors?.aggregate<AuthorResponse>([
            {
                $match: {
                    _id: new ObjectId(authorId)
                }
            },
            {
                // Join the books collection to get the books written by this author
                $lookup: {
                    from: 'books', // Collection to join
                    localField: 'books', // Field from this collection ("books" array of ids)
                    foreignField: '_id', // Field from the joined "books" collection
                    pipeline: [
                        {
                            // Project only the title and the isbn
                            $project: {
                                isbn: '$_id', // Rename _id to isbn
                                _id: 0, // Exclude _id
                                title: 1, // Include title
                                cover: 1, // Include cover
                            }
                        }
                    ],
                    as: 'books' // Store the joined result in the books field
                }
            }
        ]).toArray();

        return author && author[0];
    }
}
