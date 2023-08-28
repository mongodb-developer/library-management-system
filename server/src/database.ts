import * as mongodb from 'mongodb';
import { Book } from './models/book';
import { IssueDetail } from './models/issue-detail';
import { Author } from './models/author';
import { Review } from './models/review';
import { User } from './models/user';

export const collections: {
    books?: mongodb.Collection<Book>;
    authors?: mongodb.Collection<Author>;
    reviews?: mongodb.Collection<Review>;
    users?: mongodb.Collection<User>;
    issueDetails?: mongodb.Collection<IssueDetail>;
} = {};

export async function connectToDatabase(uri?: string) {
    if (!uri || typeof uri !== 'string') {
        throw new Error('Database URI is not defined');
    }

    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db(process.env.DATABASE_NAME);

    const booksCollection = db.collection<Book>('books');
    const authorsCollection = db.collection<Author>('authors');
    const reviewsCollection = db.collection<Review>('reviews');
    const usersCollection = db.collection<User>('users');
    const issueDetailCollection = db.collection<IssueDetail>('issueDetails');

    collections.books = booksCollection;
    collections.authors = authorsCollection;
    collections.reviews = reviewsCollection;
    collections.users = usersCollection;
    collections.issueDetails = issueDetailCollection;

    return client;
}
