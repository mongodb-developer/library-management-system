/**
 * Borrowed Book model as returned by the API.
 */
export interface BorrowedBook {
    _id: string;
    user: {
        _id: string;
        name: string;
    }

    book: {
        _id: string;
        title: string;
    }

    returned: boolean;
    returnedDate: string;

    borrowDate: string;
    dueDate: string;
}
