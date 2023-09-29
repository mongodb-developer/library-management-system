import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NewReview } from './models/new-review';
import { URL } from './config';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) { }

  addReview(review: NewReview, bookId: string) {
    return this.http.post(`${URL}/books/${bookId}/reviews`, review);
  }
}
