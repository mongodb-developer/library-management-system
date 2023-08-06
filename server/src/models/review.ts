import { ObjectId } from 'mongodb';

export interface Review {
    _id: ObjectId;
    text: string;
    name: string;
    rating: number;

    /**
     * Reference to the book collection.
     */
    bookId: string;
}