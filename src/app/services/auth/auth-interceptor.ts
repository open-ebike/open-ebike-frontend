import { inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';

/**
 * Handles the access token being passed for each http call
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /** OAuth service */
  private oauthService = inject(OAuthService);

  /**
   * Intercepts an http request
   * @param req request
   * @param next http handler
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const accessToken = this.oauthService.getAccessToken();

    if (accessToken) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
      });
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
