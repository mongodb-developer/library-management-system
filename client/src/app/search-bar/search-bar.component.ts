import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, Subject, EMPTY, filter, map, switchMap, takeUntil } from 'rxjs';

import { Book } from '../models/book';
import { RagResponse } from '../models/rag-response';
import { BookService } from '../book.service';

type SearchType = 'keyword' | 'semantic' | 'rag';

@Component({
  selector: 'lms-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnDestroy {
  @Output() itemsFound = new EventEmitter<Book[]>();
  @Output() ragAnswer = new EventEmitter<RagResponse | null>();

  private submit$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  searchForm = this.fb.group({
    query: this.fb.control('', { validators: [Validators.required], nonNullable: true }),
    searchType: this.fb.control<SearchType>('keyword', { nonNullable: true })
  });

  constructor(
    private bookService: BookService,
    private fb: FormBuilder
  ) {
    this.search()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if ('answer' in result) {
          this.itemsFound.emit([]);
          this.ragAnswer.emit(result);
        } else {
          this.itemsFound.emit(result);
          this.ragAnswer.emit(null);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(): void {
    this.submit$.next();
  }

  onEnter(event: Event): void {
    event.preventDefault();
    this.onSearch();
  }

  private search(): Observable<Book[] | RagResponse> {
    return this.submit$.pipe(
      map(() => {
        const query = this.searchForm.controls.query.value.trim();
        const type = this.searchForm.controls.searchType.value;
        return { query, type };
      }),
      filter(({ query }) => query.length > 1),
      switchMap(({ query, type }) => {
        if (type === 'rag') {
          return this.bookService.askLibrary(query);
        }
        return this.bookService.search(query, type);
      })
    );
  }
}
