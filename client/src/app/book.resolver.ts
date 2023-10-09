import { ResolveFn, Router } from '@angular/router';
import { BookView } from './models/book-view';
import { inject } from '@angular/core';
import { BookService } from './book.service';
import { tap } from 'rxjs';

export const bookResolver: ResolveFn<BookView | null> = (route, state) => {
  const bookService = inject(BookService);
  const router = inject(Router);

  const isbn = route.paramMap.get('isbn');

  if (!isbn) {
    router.navigate(['/404']);
  }

  return bookService.getBook(isbn as string)
    .pipe(
      tap((book: BookView) => {
        if (!book) {
          router.navigate(['/404']);
        }
      })
    );
};
