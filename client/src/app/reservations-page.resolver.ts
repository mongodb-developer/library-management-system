import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ReservationService } from './reservation.service';
import { Page } from './models/page-view';
import { Reservation } from './models/reservation';

export const reservationsPageResolver: ResolveFn<Page<Reservation>> = (route, state) => {
  const reservationsService = inject(ReservationService);

  return reservationsService.getReservationsPage();
};
