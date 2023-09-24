import { ResolveFn } from '@angular/router';

export const bookResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
