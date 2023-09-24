import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { Observable, map, of } from 'rxjs';
import { Book } from '../models/book';
import { BookView } from '../models/book-view';
import { Router } from '@angular/router';

@Component({
  selector: 'lms-books-catalogue',
  templateUrl: './books-catalogue.component.html',
  styleUrls: ['./books-catalogue.component.scss']
})
export class BooksCatalogueComponent implements OnInit {
  books$: Observable<BookView[]>;

  constructor(
    private bookService: BookService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.books$ = this.bookService.list();
  }

  updateItems(items: Book[]) {
    this.books$ = of(items)
      .pipe(
        map(books => books.map(book => new BookView(book)))
      );
  }

  goToBook(book: BookView) {
    this.router.navigate(['/books', book.isbn]);
  }
}
