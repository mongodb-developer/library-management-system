import { ObjectId } from 'mongodb';

export interface Review {
    _id: ObjectId;
    text: string;
    name: string;
    rating?: number; // Optional as it could be added in a NLP Lab
    timestamp: number;

    /**
     * Reference to the book collection.
     */
    bookId: string;
}