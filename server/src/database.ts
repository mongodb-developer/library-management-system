import * as mongodb from 'mongodb';
import { Book } from './interfaces/book';

export const collections: {
    books?: mongodb.Collection<Book>;
} = {};

export async function connectToDatabase(uri?: string) {
    if (!uri || typeof uri !== 'string') {
        throw new Error('Database URI is not defined');
    }

    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db(process.env.DATABASE_NAME);

    const booksCollection = db.collection<Book>('books');
    collections.books = booksCollection;
}

