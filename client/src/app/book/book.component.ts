import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../book.service';
import { BookView } from '../models/book-view';
import { Reservation } from '../models/reservation';

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
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(
        ({ book, reservations }) => {
          this.book = book;
          console.log(reservations);
          this.setUserReservation(reservations);
        });
  }

  reserve() {
    this.bookService.reserve(this.book.isbn)
      .subscribe(response => console.dir(response));
  }

  setUserReservation(reservations: Reservation[]) {
    this.reservation = reservations.find(r => r.book._id === this.book.isbn);
  }
}
