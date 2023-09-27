import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { BorrowedBookService } from './borrowed-book.service';
import { BorrowedBook } from './models/borrowed-book';

export const userBorrowedBooksResolver: ResolveFn<BorrowedBook[]> = (route, state) => {
  const borrowedBooksService = inject(BorrowedBookService);

  return borrowedBooksService.getLoggedInUserBorrowedBooks();
};

