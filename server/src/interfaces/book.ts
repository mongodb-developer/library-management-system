import { ObjectId } from 'mongodb';

export interface Book {
    _id: string; // ISBN
    title: string;
    authors: Array<AuthorExtendedReference>;
    genres: Array<string>;

    cover: string; // URL to cover image
    year: number;
    pages: number;

    totalInventory: number;

    attributes: Array<Attribute>; 
}

interface AuthorExtendedReference {
    _id: ObjectId;
    name: string;
}

interface Attribute {
    key: string;
    value: string;
}