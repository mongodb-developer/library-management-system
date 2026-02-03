import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { Observable, map, of } from 'rxjs';
import { Book } from '../models/book';
import { BookView } from '../models/book-view';
import { Router } from '@angular/router';
import { RagResponse } from '../models/rag-response';

@Component({
  selector: 'lms-books-catalogue',
  templateUrl: './books-catalogue.component.html',
  styleUrls: ['./books-catalogue.component.scss']
})
export class BooksCatalogueComponent implements OnInit {
  books$: Observable<BookView[]>;
  ragResponse: RagResponse | null = null;
  ragBooks$: Observable<BookView[]> | null = null;

  constructor(
    private bookService: BookService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.books$ = this.bookService.list();
  }

  updateItems(items: Book[]) {
    this.ragResponse = null;
    this.ragBooks$ = null;
  
    this.books$ = of(items).pipe(
      map(books => books.map(book => new BookView(book)))
    );
  }
  

  goToBook(book: BookView) {
    this.router.navigate(['/books', book.isbn]);
  }

  onRagAnswer(response: RagResponse | null) {
    this.ragResponse = response;
  
    if (!response) {
      this.ragBooks$ = null;
      return;
    }
  
    const books = response.books ?? [];
    this.ragBooks$ = of(books).pipe(
      map(bs => bs.map(b => new BookView(b)))
    );
  
    this.books$ = of([]);
  }
  
}
