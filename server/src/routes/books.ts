import { Router } from 'express';
import { collections } from '../database.js';
import { IAuthRequest } from '../utils/typescript.js';
import { protectedRoute } from '../utils/helpers.js';
import BookController from '../controllers/books.js';

// The router will be added as a middleware and will take control of requests starting with /books.
const books = Router();
export default books;

const bookController = new BookController();

books.get('/', async (req, res) => {
    return res.json(await bookController.getBooks(req?.query?.limit, req?.query?.skip));
});

books.post('/', protectedRoute, async (req: IAuthRequest, res) => {
    if (req?.auth?.isAdmin !== true) {
        return res.status(403).send({message: bookController.errors.ADMIN_ONLY});
    }

    const book = req?.body;

    if (!book || Object.keys(book).length === 0) {
        return res.status(400).send({message: bookController.errors.DETAILS_MISSING});
    }

    try {
        const result = await bookController.createBook(req?.body);
        return res.status(201).send({ result, message: bookController.success.CREATED });
    } catch (error) {
        return res.status(500).send({message: error});
    }
});

books.get('/:bookId', async (req, res) => {
    const bookId = req?.params?.bookId;

    if (!bookId) {
        return res.status(400).send({message: bookController.errors.BOOK_ID_MISSING});
    }

    const book = await bookController.getBook(bookId);

    if (!book){
        return res.status(404).send({message: bookController.errors.NOT_FOUND});
    }

    return res.json(book);
});

books.put('/:bookId', protectedRoute, async (req: IAuthRequest, res) => {
    if (req?.auth?.isAdmin !== true) {
        return res.status(403).send({message: bookController.errors.ADMIN_ONLY});
    }

    const bookId = req?.params?.bookId;
    const book = req?.body;

    if (!bookId) {
        return res.status(400).send({message: bookController.errors.BOOK_ID_MISSING});
    }

    if (!book || Object.keys(book).length === 0) {
        return res.status(400).send({message: bookController.errors.DETAILS_MISSING});
    }

    try {
        const result = await collections?.books?.updateOne({ _id: bookId }, { $set: book });
        return res.status(200).send({result, message: bookController.success.UPDATED});
    } catch(error) {
        return res.status(500).send({message: error});
    }
});

books.delete('/:bookId', protectedRoute, async (req: IAuthRequest, res) => {
    if (req?.auth?.isAdmin !== true) {
        return res.status(403).send({message: bookController.errors.ADMIN_ONLY});
    }

    const bookId = req?.params?.bookId;

    if (!bookId) {
        return res.status(400).send({message: bookController.errors.BOOK_ID_MISSING});
    }

    try {
        const result = await collections?.books?.deleteOne({ _id: bookId });
        return res.status(202).send({result, message: bookController.success.DELETED});
    } catch (error) {
        if (error === bookController.errors.NOT_FOUND) return res.status(404).send({ message: error });
        return res.status(500).send({message: error});
    }
});

