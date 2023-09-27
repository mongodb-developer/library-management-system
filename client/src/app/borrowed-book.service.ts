import { Injectable } from '@angular/core';
import { BorrowedBook } from './models/borrowed-book';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { PAGE_SIZE, Page } from './models/page-view';

const URL = 'http://localhost:5000';

@Injectable({
  providedIn: 'root'
})
export class BorrowedBookService {

  constructor(private http: HttpClient) { }

  getBorrowedBooksPage(limit = PAGE_SIZE, skip = 0) {
    return this.http.get<Page<BorrowedBook>>(`${URL}/borrow/page?limit=${limit}&skip=${skip}`);
  }

  borrowBook(isbn: string, userId: string) {
    return this.http.post<any>(`${URL}/borrow/${isbn}/${userId}`, {});
  }

  returnBook(isbn: string, userId: string) {
    return this.http.post<any>(`${URL}/borrow/${isbn}/${userId}/return`, {});
  }
}
