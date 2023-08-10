import { Router } from 'express';
import { Filter, FindOptions } from 'mongodb';
import { Book } from '../models/book.js';
import { collections } from '../database.js';
import { IAuthRequest } from '../utils/typescript.js';
import { protectedRoute } from '../utils/helpers.js';

// The router will be added as a middleware and will take control of requests starting with /books.
const books = Router();
export default books;

books.get('/', async (req, res) => {
    let limit = parseInt(req?.query?.limit as string) || 12;

    if (limit > 100) {
        limit = 100;
    }

    const skip = parseInt(req?.query?.skip as string) || 0;
    const filter = {} as Filter<Book>;
    const project = {_id: 0} as FindOptions<Book>;

    const bookCursor = await collections?.books?.find(filter, project);
    const books = bookCursor.limit(limit).skip(skip).toArray();

    return res.json(await books);
});

books.post('/', protectedRoute, async (req: IAuthRequest, res) => {
    if (req?.auth?.isAdmin !== true) {
        return res.status(403).send({message: 'Only admins can create books'});
    }

    const book = req?.body;

    if (!book || Object.keys(book).length === 0) {
        return res.status(400).send({message: 'Book details are missing'});
    }

    const result = await collections?.books?.insertOne(book);

    if (result?.insertedId) {
        return res.status(201).send({
            message: `Created a new book with id ${result.insertedId}`,
            insertedId: result.insertedId
        });
    }

    return res.status(500).send({message: 'Failed to create a new book'});
});

books.get('/:bookId', async (req, res) => {
    const bookId = req?.params?.bookId;

    if (!bookId) {
        return res.status(400).send({message: 'Book id is missing'});
    }

    const book = await collections?.books?.findOne({ _id: bookId });

    if (book) {
        return res.json(book);
    }

    return res.status(404).send({message: `Book with id ${bookId} was not found`});
});

books.put('/:bookId', protectedRoute, async (req: IAuthRequest, res) => {
    if (req?.auth?.isAdmin !== true) {
        return res.status(403).send({message: 'Only admins can update books'});
    }

    const bookId = req?.params?.bookId;
    const book = req?.body;

    if (!bookId) {
        return res.status(400).send({message: 'Book id is missing'});
    }

    if (!book || Object.keys(book).length === 0) {
        return res.status(400).send({message: 'Book details are missing'});
    }

    const result = await collections?.books?.updateOne({ _id: bookId }, { $set: book });

    if (result?.modifiedCount) {
        return res.send({
            message: `Updated book with id ${bookId}`,
            newBook: book
        });
    }

    return res.status(500).send({message: `Failed to update book with id ${bookId}`});
});

books.delete('/:bookId', protectedRoute, async (req: IAuthRequest, res) => {
    if (req?.auth?.isAdmin !== true) {
        return res.status(403).send({message: 'Only admins can delete books'});
    }

    const bookId = req?.params?.bookId;

    if (!bookId) {
        return res.status(400).send({message: 'Book id is missing'});
    }

    try {
        const result = await collections?.books?.deleteOne({ _id: bookId });

        if (result?.deletedCount) {
            await collections?.reviews?.deleteMany({ bookId });
            await collections?.issueDetails?.deleteMany({ 'book._id': bookId });
            res.status(202).send({message: `Removed book with id ${bookId}`});
        } else if (!result) {
            res.status(400).send({message: `Book with id ${bookId} does not exist`});
        } else if (!result.deletedCount) {
            res.status(404).send({message: `Book with id ${bookId} was not found`});
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).send({message: `Failed to delete book with id ${bookId}`});
    }
});

