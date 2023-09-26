import { Component, Input } from '@angular/core';
import { Review } from '../models/review';

@Component({
  selector: 'lms-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent {
  @Input() review: Review;
}
