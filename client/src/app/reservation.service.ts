import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { Reservation } from './models/reservation';
import { switchMap } from 'rxjs';
import { PAGE_SIZE, Page } from './models/page-view';
import { URL } from './config';

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

  getReservationsPage(limit = PAGE_SIZE, skip = 0) {
    return this.http.get<Page<Reservation>>(`${URL}/reservations/page?limit=${limit}&skip=${skip}`);
  }

  createReservation(isbn: string) {
    return this.http.post(`${URL}/reservations/${isbn}`, {});
  }

  cancelReservation(isbn: string) {
    return this.http.delete(`${URL}/reservations/${isbn}`);
  }
}
