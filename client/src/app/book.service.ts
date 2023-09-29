import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from './models/book';
import { Observable, map, of } from 'rxjs';
import { BookView } from './models/book-view';
import { URL } from './config';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  constructor(private http: HttpClient) { }

  list(limit = 12, skip = 0) {
    if (limit > 100) {
      limit = 100;
    }

    return this.http.get<Book[]>(`${URL}/books?limit=${limit}?skip=${skip}`)
      .pipe(
        map(books => books.map(book => new BookView(book)))
      )
  }

  getBook(isbn: string) {
    return this.http.get<Book>(`${URL}/books/${isbn}`)
      .pipe(
        map(book => new BookView(book))
      );
  }

  search(query: string, limit = 12): Observable<Book[]> {
    if (limit > 100) {
      limit = 100;
    }

    return this.http.get<Book[]>(`${URL}/books/search?term=${query}`);
  }
}
