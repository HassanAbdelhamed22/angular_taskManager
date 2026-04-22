import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  const username = localStorage.getItem('username');

  if (username) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
