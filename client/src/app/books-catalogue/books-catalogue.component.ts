import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { Observable, map, of } from 'rxjs';
import { Book } from '../models/book';
import { BookView } from '../models/book-view';

@Component({
  selector: 'lms-books-catalogue',
  templateUrl: './books-catalogue.component.html',
  styleUrls: ['./books-catalogue.component.scss']
})
export class BooksCatalogueComponent implements OnInit {
  books$: Observable<BookView[]>;

  constructor(private bookService: BookService) {
  }

  ngOnInit(): void {
    this.books$ = this.bookService.list()
      .pipe(
        map(books => books.map(book => new BookView(book)))
      );
  }

  updateItems(items: Book[]) {
    this.books$ = of(items)
      .pipe(
        map(books => books.map(book => new BookView(book)))
      );
  }
}
