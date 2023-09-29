import { ObjectId } from 'mongodb';
import { Review } from './review';

export interface Book {
    /**
     * ISBN (International Standard Book Number) of the book.
     */
    _id: string;
    title: string;
    year: number;

    /**
     * URL to cover image.
     */
    cover?: string;
    genres?: Array<string>;
    pages?: number;
    synopsis?: string;
    publisher?: string;
    longTitle?: string;
    language?: string;
    binding?: string;

    /**
     * Number of books in total.
     */
    totalInventory: number;

    /**
     * Number of books currently available.
     * This field is computed. See https://www.mongodb.com/blog/post/building-with-patterns-the-computed-pattern.
     */
    available: number;

    /**
     * Array of author references following the extended reference pattern.
     * See https://www.mongodb.com/blog/post/building-with-patterns-the-extended-reference-pattern.
     */
    authors?: Array<{
        _id: ObjectId;
        name: string
    }>;

    /**
     * Array of attributes following the attribute pattern (key-value pairs).
     * See https://www.mongodb.com/blog/post/building-with-patterns-the-attribute-pattern.
     */
    attributes: Array<{
        key: string;
        value: string;
    }>;

    /**
     * Array of reviews following the subset pattern.
     * See https://www.mongodb.com/blog/post/building-with-patterns-the-subset-pattern.
     */
    reviews: Array<Omit<Review, '_id' | 'bookId'>>;

    /**
     * Added for the Search Lab
     */
    bookOfTheMonth?: boolean;
}
