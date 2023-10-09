import { ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { Author } from './models/author';
import { AuthorService } from './author.service';

export const authorResolver: ResolveFn<Author | null> = (route, state) => {
  const authorService = inject(AuthorService);
  const router = inject(Router);

  const authorId = route.paramMap.get('id');

  if (!authorId) {
    router.navigate(['/404']);
  }

  return authorService.getAuthor(authorId!)
    .pipe(
      tap((author: Author) => {
        if (!author) {
          router.navigate(['/404']);
        }
      })
    );
};
