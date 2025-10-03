import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication.service';

/**
 * Handles feature authentication
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  /** Authentication service */
  private authenticationService = inject(AuthenticationService);
  /** Router */
  private router = inject(Router);

  /**
   * Checks if a feature can be activated
   * @param route route
   * @param state state
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.authenticationService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
