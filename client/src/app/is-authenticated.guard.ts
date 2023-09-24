import { CanActivateFn } from '@angular/router';
import { UserService } from './user.service';
import { inject } from '@angular/core';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const user = userService.getLoggedInUser();

  return !!user;
};
