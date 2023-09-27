import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ReservationService } from './reservation.service';
import { Reservation } from './models/reservation';

export const reservationsResolver: ResolveFn<Reservation[]> = (route, state) => {
  const reservationService = inject(ReservationService);

  return reservationService.getLoggedInUserReservations();
};
