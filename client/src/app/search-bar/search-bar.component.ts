import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  Observable,
  Subject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  merge,
  startWith,
  switchMap
} from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';

import { Book } from '../models/book';
import { RagResponse } from '../models/rag-response';
import { BookService } from '../book.service';

@Component({
  selector: 'lms-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {

  @Output() itemsFound = new EventEmitter<Book[]>();
  @Output() ragAnswer = new EventEmitter<RagResponse>();

  private ragSubmit$ = new Subject<void>();

  searchForm = this.fb.group({
    query: ['', Validators.required],
    searchType: ['keyword']
  });

  constructor(
    private bookService: BookService,
    private fb: FormBuilder
  ) {
    this.search().subscribe(result => {
      if ('answer' in result) {
        this.itemsFound.emit([]);
        this.ragAnswer.emit(result);
      } else {
        this.itemsFound.emit(result);
      }
    });
  }

  onEnter() {
    if (this.searchForm.controls.searchType.value === 'rag') {
      this.ragSubmit$.next();
    }
  }

  private search(): Observable<Book[] | RagResponse> {

    const query$ = this.searchForm.controls.query.valueChanges.pipe(
      startWith(this.searchForm.controls.query.value),
      filter((q): q is string => !!q && q.length > 1)
    );

    const searchType$ = this.searchForm.controls.searchType.valueChanges.pipe(
      startWith(this.searchForm.controls.searchType.value)
    );

    // Keyword + Semantic (reactive, debounced)
    const normalSearch$ = combineLatest([query$, searchType$]).pipe(
      filter(([_, type]) => type !== 'rag'),
      debounceTime(700),
      distinctUntilChanged(
        (a, b) => a[0] === b[0] && a[1] === b[1]
      ),
      switchMap(([query, type]) =>
        this.bookService.search(query, type)
      )
    );

    // RAG (explicit Enter only)
    const ragSearch$ = this.ragSubmit$.pipe(
      withLatestFrom(query$),
      switchMap(([_, query]) =>
        this.bookService.askLibrary(query)
      )
    );

    return merge(normalSearch$, ragSearch$);
  }
}
