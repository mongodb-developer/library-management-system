import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserService } from './user.service';

export const canLoadProfileGuard: CanActivateFn = (route, state) => {
  const username = route.paramMap.get('username');
  if (!username) {
    return false;
  }

  const userService = inject(UserService);
  const user = userService.getLoggedInUser();

  return user?.name === username;;
};
