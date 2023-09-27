import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../book.service';
import { BookView } from '../models/book-view';
import { Reservation } from '../models/reservation';
import { ReservationService } from '../reservation.service';

@Component({
  selector: 'lms-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {
  book: BookView;
  reservation: Reservation | undefined;

  constructor(
    private bookService: BookService,
    private reservationService: ReservationService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(
      ({ book, reservations }) => {
        this.book = book;
        this.setUserReservation(reservations);
      });
  }

  reserve() {
    this.reservationService.createReservation(this.book.isbn)
      .subscribe(response => {
        this.reservationService.getLoggedInUserReservations()
          .subscribe(reservations => this.setUserReservation(reservations)
          );
      });
  }

  cancelReservation() {
    this.reservationService.cancelReservation(this.book.isbn)
      .subscribe(response => {
        this.refetchBook();
        this.reservationService.getLoggedInUserReservations()
          .subscribe(reservations => this.setUserReservation(reservations)
          );
      });
  }

  setUserReservation(reservations: Reservation[]) {
    this.reservation = reservations.find(r => r.book._id === this.book.isbn);
  }

  refetchBook() {
    this.bookService.getBook(this.book.isbn)
      .subscribe(book => this.book = book);
  }
}
