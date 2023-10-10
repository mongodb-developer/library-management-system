import { Component } from '@angular/core';
import { Author } from '../models/author';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lms-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss']
})
export class AuthorComponent {
  author: Author;

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(
      ({ author }) => {
        this.author = author;
      });
  }
}
