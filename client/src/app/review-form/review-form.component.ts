import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReviewService } from '../review.service';

@Component({
  selector: 'lms-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.scss']
})
export class ReviewFormComponent {
  @Input() bookId: string;
  @Output() reviewAdded = new EventEmitter();

  reviewForm = this.fb.group({
    text: ['', Validators.required],
    rating: [1, [Validators.min(1), Validators.max(5)]],
  });

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService
  ) {
  }

  updateRating($event: number) {
    this.reviewForm.patchValue({ rating: $event });
  }

  submit() {
    const review: any = {};
    const text = this.reviewForm.value.text;
    if (!text) {
      return;
    }
    review.text = text;

    const rating = this.reviewForm.value.rating;
    if (!rating) {
      return;
    }
    review.rating = rating;

    this.reviewForm.disable();

    this.reviewService.addReview(review, this.bookId)
      .subscribe(response => {
        this.reviewAdded.emit();
      });
  }
}
