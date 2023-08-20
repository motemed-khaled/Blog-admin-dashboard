import { ɵɵinject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = ɵɵinject(AuthService);
  const router = ɵɵinject(Router);
  const toastr = ɵɵinject(ToastrService);

  if (authService.logedGuard) {
    return true
  } else {
    router.navigate(["/login"]);
    toastr.warning('You dont have a permission to access this route...');
    return false;
  }
};
