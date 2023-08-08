import { ObjectId, Filter, FindOptions, InsertOneResult } from 'mongodb';
import { Route, Get, Post, Query, Body, SuccessResponse, Controller } from 'tsoa';
import { collections } from '../database.js';
import { Book } from '../models/book.js';

@Route('books')
class BookController extends Controller {

    @Get('/')
    async getBooks(@Query() limit?: number, @Query() skip?: number): Promise<Array<Omit<Book, '_id'>>> {
        if (!limit) limit = 12;
        if (!skip) skip = 0;

        if (limit > 100) {
            limit = 100;
        }

        const filter = {} as Filter<Book>;
        const project = {_id: 0} as FindOptions<Book>;

        const bookCursor = await collections?.books?.find(filter, project);
        const books = bookCursor.limit(limit).skip(skip).toArray();

        return books;
    }

    @SuccessResponse('201', 'Created')
    @Post()
    async createBook(@Body() book: Omit<Book, '_id'>): Promise<InsertOneResult|string> {

        if (!book || Object.keys(book).length === 0) {
            this.setStatus(400);
            return 'Book details are missing';
        }

        const result = await collections?.books?.insertOne(book as Book);

        if (result?.insertedId) {
            this.setStatus(201);
            return result;
        }

        this.setStatus(500);
        return 'Failed to create a new book';
    }

    async getBook(req, res) {
        const id = req?.params?.id;

        if (!id) {
            return res.status(400).send('Book id is missing');
        }

        const book = await collections?.books?.findOne({ _id: id });

        if (book) {
            return res.json(book);
        }

        return res.status(404).send(`Book with id ${id} was not found`);
    }

    async updateBook(req, res) {
        const id = req?.params?.id;
        const book = req?.body;

        if (!id) {
            return res.status(400).send('Book id is missing');
        }

        if (!book || Object.keys(book).length === 0) {
            return res.status(400).send('Book details are missing');
        }

        const result = await collections?.books?.updateOne({ _id: id }, { $set: book });

        if (result?.modifiedCount) {
            return res.send(`Updated book with id ${id}`);
        }

        return res.status(500).send(`Failed to update book with id ${id}`);
    }

    async deleteBook(req, res) {
        const id = req?.params?.id;

        if (!id) {
            return res.status(400).send('Book id is missing');
        }

        try {
            const result = await collections?.books?.deleteOne({ _id: id });

            if (result?.deletedCount) {
                res.status(202).send(`Removed book with id ${id}`);
            } else if (!result) {
                res.status(400).send(`Book with id ${id} does not exist`);
            } else if (!result.deletedCount) {
                res.status(404).send(`Book with id ${id} was not found`);
            }
        } catch (error) {
            console.error(error.message);
            return res.status(500).send(`Failed to delete book with id ${id}`);
        }
    }

    async getBookReviews(req, res) {
        const id = req?.params?.id;

        if (!id) {
            return res.status(400).send('Book id is missing');
        }

        try {
            const reviews = await collections?.reviews?.find({ bookId: id }).toArray();
            return res.json(reviews);
        } catch (error) {
            console.error(error.message);
            return res.status(500).send(`Failed to get reviews for book with id ${id}`);
        }
    }

    async createBookReview(req, res) {
        const id = req?.params?.id;
        const review = req?.body;

        if (!id) {
            return res.status(400).send('Book id is missing');
        }

        if (!review) {
            return res.status(400).send('Review details are missing');
        }

        review.bookId = id;
        const result = await collections?.reviews?.insertOne(review);

        if (result?.insertedId) {
            return res.status(201).send(`Created a new review with id ${result.insertedId}`);
        }

        return res.status(500).send('Failed to create a new review');
    }

    async getBookReview(req, res) {
        const id = req?.params?.id;
        const reviewId = req?.params?.reviewId;

        if (!id) {
            return res.status(400).send('Book id is missing');
        }

        if (!reviewId) {
            return res.status(400).send('Review id is missing');
        }

        const review = await collections?.reviews?.findOne({ _id: new ObjectId(reviewId), bookId: id });


        if (review) {
            return res.json(review);
        }

        return res.status(404).send(`Review with id ${reviewId} was not found`);
    }
}

export { BookController };