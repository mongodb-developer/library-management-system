import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { filter, debounceTime, distinctUntilChanged, switchMap, Observable } from 'rxjs';
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
  });

  constructor(
    private bookService: BookService,
    private fb: FormBuilder,
  ) {
    this.search(this.searchForm.controls.query).subscribe(
      items => {
        this.itemsFound.next(items);
      }
    );
  }

  private search(formControl: FormControl<any>): Observable<Book[]> {
    return formControl.valueChanges.pipe(
      filter(text => text!.length > 1),
      debounceTime(700),
      distinctUntilChanged(),
      switchMap(searchTerm => this.bookService.search(searchTerm!)),
    );
  }
}
