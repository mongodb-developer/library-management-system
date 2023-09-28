/**
 * Reservation model as returned by the API.
 */
export interface Reservation {
    _id: string;
    user: {
        _id: string;
        name: string;
    }

    book: {
        _id: string;
        title: string;
    }

    expirationDate: string;
}
