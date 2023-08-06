import { ObjectId } from 'mongodb';

export interface Author {
    _id: ObjectId
    name: string;
    sanitizedName: string;
    aliases: Array<string>;
    bio?: string;

    /**
     * Array of ISBNs of books written by this author. Reference to the books collection.
     */
    books: Array<string>;
}
