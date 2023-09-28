import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { UserService } from './user.service';
import { User } from './models/user';

export const userResolver: ResolveFn<User | null> = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const username = route.paramMap.get('username');

  if (!username) {
    return userService.login();
  }

  const user = userService.getLoggedInUser();
  if (!user || user.name !== username) {
    router.navigate(['/404']);
    return null;
  } else {
    return user;
  }
};
