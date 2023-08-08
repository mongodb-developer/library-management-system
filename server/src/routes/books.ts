import { Router } from 'express';
import {BookController} from '../controllers/book.js';

// The router will be added as a middleware and will take control of requests starting with /books.
const books = Router();

const bookController = new BookController();

books.route('/').get(async (req, res) => {
    const books = await bookController.getBooks(parseInt(req?.query?.limit as string), parseInt(req?.query?.skip as string));
    return res.json(books).status(200);
});

books.route('/').post(bookController.createBook);
books.route('/:id').get(bookController.getBook);
books.route('/:id').put(bookController.updateBook);
books.route('/:id').delete(bookController.deleteBook);
books.route('/:id/reviews').get(bookController.getBookReviews);
books.route('/:id/reviews').post(bookController.createBookReview);
books.route('/:id/reviews/:reviewId').get(bookController.getBookReview);

export default books;