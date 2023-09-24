import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { Reservation } from './models/reservation';

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
    if (!user) {
      throw new Error('User is not logged in');
    }

    return this.http.get<Reservation>(`${URL}/reservations`);
  }
}
