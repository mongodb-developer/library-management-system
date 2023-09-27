import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../reservation.service';
import { Reservation } from '../models/reservation';
import { BorrowedBookService } from '../borrowed-book.service';
import { BorrowedBook } from '../models/borrowed-book';

@Component({
  selector: 'lms-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = [
    'book',
    'user',
    'expirationDate',
    'actions'
  ];

  displayedColumnsBorrows: string[] = [
    'book',
    'user',
    'borrowDate',
    'dueDate',
    'returnedDate',
    'returned',
    'actions'
  ];

  reservations: Reservation[] = [];
  borrowedBooks: BorrowedBook[] = [];

  constructor(
    private reservationService: ReservationService,
    private borrowedBookService: BorrowedBookService,
  ) {
  }

  ngOnInit() {
    this.fetchReservations();
    this.fetchBorrowedBooks();
  }

  cancelReservation(reservation: Reservation) {
    this.reservationService.cancelReservation(reservation.book._id)
      .subscribe(() => this.fetchReservations());
  }

  lendBook(reservation: Reservation) {
    console.dir(reservation);
    this.borrowedBookService.borrowBook(reservation.book._id, reservation.user._id)
      .subscribe(() => {
        this.fetchBorrowedBooks();
        this.fetchReservations();
      });
  }

  returnBook(borrowedBook: BorrowedBook) {
    this.borrowedBookService.returnBook(borrowedBook.book._id, borrowedBook.user._id)
      .subscribe(() => {
        this.fetchBorrowedBooks();
        this.fetchReservations();
      });
  }

  private fetchReservations() {
    this.reservationService.getReservations()
      .subscribe(reservations => {
        this.reservations = reservations;
      });
  }

  private fetchBorrowedBooks() {
    this.borrowedBookService.getBorrowedBooks()
      .subscribe(borrowedBooks => {
        console.log(borrowedBooks);
        this.borrowedBooks = borrowedBooks;
      });
  }
}
