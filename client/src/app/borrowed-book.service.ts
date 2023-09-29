import { Injectable } from '@angular/core';
import { BorrowedBook } from './models/borrowed-book';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs';
import { PAGE_SIZE, Page } from './models/page-view';
import { UserService } from './user.service';
import { URL } from './config';

@Injectable({
  providedIn: 'root'
})
export class BorrowedBookService {

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  getLoggedInUserBorrowedBooks() {
    const user = this.userService.getLoggedInUser();
    if (user) {
      return this.http.get<BorrowedBook[]>(`${URL}/borrow`);
    }

    return this.userService.login()
      .pipe(
        switchMap(user => {
          return this.http.get<BorrowedBook[]>(`${URL}/borrow`);
        })
      );
  }

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
