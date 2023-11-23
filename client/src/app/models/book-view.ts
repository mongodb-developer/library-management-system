import { Book } from "./book";
import { Review } from "./review";

/**
 * Book model as displayed in the UI.
 */
export class BookView {
    isbn: string;
    title: string;
    year: number | 'N/A';
    cover?: string;
    available: number;
    totalInventory: number;
    reviews: Array<Omit<Review, '_id' | 'bookId'>>;
    authors: Array<{ name: string, _id: string }>;
    genres: string;
    synopsis?: string;
    publisher?: string;
    binding?: string;
    language?: string;
    bookOfTheMonth?: boolean;
    pages: number;

    constructor(book: Book) {
        this.isbn = book._id;
        this.title = book.title;
        this.year = book.year || 'N/A';
        this.cover = book.cover;
        this.available = book.available;
        this.totalInventory = book.totalInventory;
        this.reviews = book.reviews || [];
        this.authors = book.authors || [];
        this.genres = book.genres?.join(', ') || '';
        this.synopsis = book.synopsis;
        this.publisher = book.publisher;
        this.binding = book.binding;
        this.language = book.language;
        this.bookOfTheMonth = book.bookOfTheMonth || false;
        this.pages = book.pages || 0;
    }
}
