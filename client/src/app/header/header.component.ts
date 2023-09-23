import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Component({
  selector: 'lms-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user$: Observable<User>;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.user$ = this.userService.login();
  }
}
