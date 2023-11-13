import { DeleteResult, InsertOneResult, UpdateResult } from 'mongodb';
import { Book } from '../models/book';
import { collections } from '../database.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import getEmbeddings from '../embeddings/index.js';

class BookController {
    errors = {
        UNKNOWN_INSERT_ERROR: 'Unable to create book',
        UNKNOWN_UPDATE_ERROR: 'Unable to update book',
        UNKNOWN_DELETE_ERROR: 'Unable to delete book',
        NOT_FOUND: 'Book not found',
        DETAILS_MISSING: 'Book details are missing',
        BOOK_ID_MISSING: 'Book id is missing',
        ADMIN_ONLY: 'This operation is only allowed for admins',
        NOT_AVAILABLE: 'Book is not available'
    };

    success = {
        CREATED: 'Book created',
        UPDATED: 'Book updated',
        DELETED: 'Book deleted'
    };

    public async getBooks(limit: number = 12, skip: number = 0): Promise<Book[]> {
        if (limit > 100) {
            limit = 100;
        }

        const bookCursor = collections?.books?.find({});
        const books = await bookCursor.limit(limit).skip(skip).toArray();

        return books;
    }

    public async getBook(bookId: string): Promise<Book> {
        /**
         * Initial Code
         * Task: Optimise the query to take advantage of the already computed field.
         * Hint: Take a look at the shape of the Book documents using MongoDB Compass.
         */
        const books = await collections?.books?.aggregate<Book>([
            {
                $match: {
                    _id: bookId
                },
            },
            {
                $lookup: {
                    from: 'issueDetails',
                    localField: '_id',
                    foreignField: 'book._id',
                    pipeline: [
                        {
                            $match: {
                                $or: [
                                    { recordType: 'reservation' },
                                    { recordType: 'borrowedBook', returned: false }
                                ]
                            }
                        }
                    ],
                    as: 'details'
                }
            },
            {
                $set: {
                    available: {
                        $subtract: ['$totalInventory', { $size: '$details' }]
                    }
                }
            },
            {
                $unset: 'details'
            },
        ]).toArray();

        if (!books?.length) {
            return;
        }

        return books[0];
    }

    public async searchBooks(query: string): Promise<Book[]> {
        const books = await collections?.books?.find(
            {
                $or: [
                    {title: {$regex: new RegExp(query, 'i')}},
                    {'authors.name': {$regex: new RegExp(query, 'i')}},
                ]
            }).limit(25).toArray();
        return books;
    }

    public async createBook(book: Book): Promise<InsertOneResult> {
        const result = await collections?.books?.insertOne(book);

        if (!result?.insertedId) {
            throw new Error(this.errors.UNKNOWN_INSERT_ERROR);
        }

        return result;
    }

    public async updateBook(bookId: string, book: Book): Promise<UpdateResult> {
        const result = await collections?.books?.updateOne({ _id: bookId }, { $set: book });

        if (result.modifiedCount === 0) {
            throw new Error(this.errors.UNKNOWN_UPDATE_ERROR);
        }

        return result;
    }

    public async deleteBook(bookId: string): Promise<DeleteResult> {
        const result = await collections?.books?.deleteOne({ _id: bookId });

        if (result.deletedCount === 0) {
            throw new Error(this.errors.UNKNOWN_UPDATE_ERROR);
        }

        if (!result) {
            throw new Error(this.errors.UNKNOWN_DELETE_ERROR);
        }

        return result;
    }

    public incrementBookInventory(bookId: string, count: number = 1): Promise<UpdateResult> {
        return this.updateBookInventory(bookId, count);
    }

    public decrementBookInventory(bookId: string, count: number = 1): Promise<UpdateResult> {
        return this.updateBookInventory(bookId, -count);
    }

    public async isBookAvailable(bookId: string): Promise<Book> {
        const bookData = await this.getBook(bookId);

        if (!bookData) {
            throw new Error(this.errors.NOT_FOUND);
        }

        if (bookData?.available <= 0) {
            throw new Error(this.errors.NOT_AVAILABLE);
        }

        return bookData;
    }

    private updateBookInventory(bookId: string, count: number): Promise<UpdateResult> {
        const result = collections?.books?.updateOne(
            { _id: bookId },
            { $inc: { available: count } }
        );
        return result;
    }
}

export default BookController;