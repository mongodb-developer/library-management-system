import { Injectable } from '@angular/core';
import { URL } from './config';
import { HttpClient } from '@angular/common/http';
import { Author } from './models/author';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  constructor(private http: HttpClient) { }

  getAuthor(authorId: string) {
    return this.http.get<Author>(`${URL}/authors/${authorId}`);
  }
}
