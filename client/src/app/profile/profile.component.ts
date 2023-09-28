import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../models/user';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BorrowedBook } from '../models/borrowed-book';
import { PAGE_SIZE } from '../models/page-view';
import { Reservation } from '../models/reservation';

@Component({
  selector: 'lms-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit {
  user: User;
  pageSize = PAGE_SIZE;

  @ViewChild('reservationsPaginator') reservationsPaginator: MatPaginator;
  reservationsTotalCount = 0;
  reservations = new MatTableDataSource<Reservation>();

  reservationsDisplayedColumns: string[] = [
    'book',
    'user',
    'expirationDate',
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
  ];

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(
      ({ user, borrowedBooks, reservations }) => {
        this.user = user;

        this.borrowedBooksTotalCount = borrowedBooks.length;
        this.borrowedBooks.data = borrowedBooks;

        this.reservationsTotalCount = reservations.length;
        this.reservations.data = reservations;
      });
  }

  ngAfterViewInit() {
    this.reservations.paginator = this.reservationsPaginator;
    this.borrowedBooks.paginator = this.borrowedBooksPaginator;
  }
}
