import { ResolveFn } from '@angular/router';
import { ReservationService } from './reservation.service';
import { inject } from '@angular/core';
import { Reservation } from './models/reservation';

export const userReservationsResolver: ResolveFn<Reservation[]> = (route, state) => {
  const reservationsService = inject(ReservationService);

  return reservationsService.getLoggedInUserReservations();
};
