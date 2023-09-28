import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ReservationService } from '../reservation.service';
import { Reservation } from '../models/reservation';
import { BorrowedBookService } from '../borrowed-book.service';
import { BorrowedBook } from '../models/borrowed-book';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { PAGE_SIZE } from '../models/page-view';

@Component({
  selector: 'lms-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  pageSize = PAGE_SIZE;

  @ViewChild('reservationsPaginator') reservationsPaginator: MatPaginator;
  reservationsTotalCount = 0;
  reservations = new MatTableDataSource<Reservation>();

  reservationsDisplayedColumns: string[] = [
    'book',
    'user',
    'expirationDate',
    'actions'
  ];

  @ViewChild('borrowedBooksPaginator') borrowedBooksPaginator: MatPaginator;
  borrowedBooksTotalCount = 0;
  borrowedBooks = new MatTableDataSource<BorrowedBook>();

  borrowsDisplayedColumns: string[] = [
    'book',
    'user',
    'borrowDate',
    'dueDate',
    'returnedDate',
    'returned',
    'actions'
  ];

  constructor(
    private reservationService: ReservationService,
    private borrowedBookService: BorrowedBookService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(
      ({ borrowedBooksPage, reservationsPage }) => {
        this.borrowedBooksTotalCount = borrowedBooksPage.totalCount;
        this.borrowedBooks.data = borrowedBooksPage.data;

        this.reservationsTotalCount = reservationsPage.totalCount;
        this.reservations.data = reservationsPage.data;
      });
  }

  ngAfterViewInit() {
    this.borrowedBooksPaginator?.page.subscribe(() => {
      this.fetchBorrowedBooks();
    });

    this.reservationsPaginator?.page.subscribe(() => {
      this.fetchReservations();
    });
  }

  cancelReservation(reservation: Reservation) {
    this.reservationService.cancelReservation(reservation.book._id)
      .subscribe(() => this.fetchReservations());
  }

  lendBook(reservation: Reservation) {
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
    const limit = this.reservationsPaginator?.pageSize || PAGE_SIZE;
    const skip = (this.reservationsPaginator?.pageIndex * this.reservationsPaginator?.pageSize) || 0;

    this.reservationService.getReservationsPage(limit, skip)
      .subscribe(reservations => {
        this.reservations.data = reservations.data;
      });
  }

  private fetchBorrowedBooks() {
    const limit = this.borrowedBooksPaginator?.pageSize || PAGE_SIZE;
    const skip = (this.borrowedBooksPaginator?.pageIndex * this.borrowedBooksPaginator?.pageSize) || 0;

    this.borrowedBookService.getBorrowedBooksPage(limit, skip)
      .subscribe(response => {
        this.borrowedBooks.data = response.data;
      });
  }
}
