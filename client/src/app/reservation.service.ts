import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { Reservation } from './models/reservation';
import { switchMap } from 'rxjs';

const URL = 'http://localhost:5000';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  getLoggedInUserReservations() {
    const user = this.userService.getLoggedInUser();
    if (user) {
      return this.http.get<Reservation[]>(`${URL}/reservations`);
    }

    return this.userService.login()
      .pipe(
        switchMap(user => {
          return this.http.get<Reservation[]>(`${URL}/reservations`);
        })
      );
  }
}
