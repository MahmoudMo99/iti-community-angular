import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const allowedRoles = route.data?.['roles'] as string[];
  if (allowedRoles && !allowedRoles.includes(role!)) {
    router.navigate([`/${role?.toLowerCase()}/dashboard`]);
    return false;
  }

  return true;
};
