import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from './models/book';
import { Observable, of } from 'rxjs';

const backendPort = "5000";
const URL = `${location.protocol}//${location.hostname.replace('-4200', `-${backendPort}`)}${location.port ? `:${backendPort}` : ""}`;


@Injectable({
  providedIn: 'root'
})
export class BookService {
  constructor(private http: HttpClient) { }

  list(limit = 12, skip = 0) {
    if (limit > 100) {
      limit = 100;
    }

    return this.http.get<Book[]>(`${URL}/books?limit=${limit}?skip=${skip}`);
  }

  search(query: string, limit = 12): Observable<Book[]> {
    if (limit > 100) {
      limit = 100;
    }

    // TODO: Uncomment this line when the API is ready.
    // return this.http.get<Book[]>(`${URL}/books/search?term=${query}&limit=${limit}`);

    return of([
      {
        _id: '1',
        totalInventory: 1,
        available: 1,
        year: 2020,
        attributes: [],
        reviews: [],
        title: 'Test book 1',
        authors: [{
          _id: '1',
          name: 'Test author 1'
        }],
        genres: ['Test genre 1'],
        synopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl vitae aliquam ultricies, nunc nisl aliquet nunc, vitae aliqu',
      }
    ]);
  }
}
