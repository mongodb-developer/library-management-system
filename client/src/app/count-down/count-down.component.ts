import { Component, Input, OnInit } from '@angular/core';
import { map, Observable, takeWhile, timer } from 'rxjs';

@Component({
  selector: 'lms-count-down',
  templateUrl: './count-down.component.html',
  styleUrls: ['./count-down.component.scss']
})
export class CountDownComponent implements OnInit {
  @Input() endDate = '';
  seconds = 0; 
  timeRemaining$: Observable<number> = new Observable();

  ngOnInit() {
    const end = new Date(this.endDate).getTime();
    const now = new Date().getTime();

    const diff = end - now;
    this.seconds = diff / 1000;

    this.timeRemaining$ = timer(0, 1000).pipe(
      map(n => (this.seconds - n) * 1000),
      takeWhile(n => n >= 0),
    );
  }
}
