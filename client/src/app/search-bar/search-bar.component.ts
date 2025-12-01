import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { filter, debounceTime, distinctUntilChanged, switchMap, Observable, combineLatest, startWith } from 'rxjs';
import { Book } from '../models/book';
import { BookService } from '../book.service';

@Component({
  selector: 'lms-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  @Output() itemsFound = new EventEmitter<Book[]>();
  itemOptions: Observable<Book[]>;

  searchForm = this.fb.group({
    query: ['', Validators.required],
    searchType: ['keyword'],
  });

  constructor(
    private bookService: BookService,
    private fb: FormBuilder,
  ) {
    this.search().subscribe(
      items => {
        this.itemsFound.next(items);
      }
    );
  }

  private search(): Observable<Book[]> {
    // Listen to changes from BOTH query and searchType
    return combineLatest([
      this.searchForm.controls.query.valueChanges.pipe(startWith('')),
      this.searchForm.controls.searchType.valueChanges.pipe(startWith('keyword'))
    ]).pipe(
      filter(([query, _]) => query!.length > 1),
      debounceTime(700),
      distinctUntilChanged((prev, curr) => 
        prev[0] === curr[0] && prev[1] === curr[1]
      ),
      switchMap(([searchTerm, searchType]) => {
        return this.bookService.search(searchTerm!, searchType);
      }),
    );
  }
}
