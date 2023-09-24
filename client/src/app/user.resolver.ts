import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UserService } from './user.service';
import { User } from './models/user';
import { of } from 'rxjs';

export const userResolver: ResolveFn<User | null> = (route, state) => {
  const userService = inject(UserService);
  const username = route.paramMap.get('username');
  console.log(username);

  if (!username) {
    return userService.login();
  }

  return of(userService.getLoggedInUser());
};
