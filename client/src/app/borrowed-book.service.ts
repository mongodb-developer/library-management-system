import { Injectable } from '@angular/core';
import { BorrowedBook } from './models/borrowed-book';
import { HttpClient } from '@angular/common/http';

const URL = 'http://localhost:5000';

@Injectable({
  providedIn: 'root'
})
export class BorrowedBookService {

  constructor(private http: HttpClient) { }

  getBorrowedBooks() {
    return this.http.get<BorrowedBook[]>(`${URL}/borrow/admin`);
  }

  borrowBook(isbn: string, userId: string) {
    return this.http.post<any>(`${URL}/borrow/${isbn}/${userId}`, {});
  }

  returnBook(isbn: string, userId: string) {
    return this.http.post<any>(`${URL}/borrow/${isbn}/${userId}/return`, {});
  }
}
