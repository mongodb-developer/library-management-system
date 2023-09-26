import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lms-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent {
  @Input('rating') rating: number = 3;
  @Input('starCount') starCount: number = 5;
  @Input('fixed') fixed: boolean = false;
  @Output() ratingUpdated = new EventEmitter();

  ratingArr: any = [];

  constructor() {
  }

  ngOnInit() {
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }

  onClick(rating: number) {
    if (this.fixed) {
      return;
    }

    this.rating = rating;
    this.ratingUpdated.emit(rating);
  }

  showIcon(index: number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
}
