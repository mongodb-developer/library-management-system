/**
 * Review model as returned by the API.
 */
export interface Review {
    _id: string;
    text: string;
    name: string;
    rating?: number;
    timestamp: number;

    /**
     * Reference to the book collection.
     */
    bookId: string;
}
