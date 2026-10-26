import { TestBed } from '@angular/core/testing';
import { AuthenticationService } from './authentication.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let mockOAuthService: jasmine.SpyObj<OAuthService>;

  beforeEach(() => {
    mockOAuthService = jasmine.createSpyObj<OAuthService>(
      'OAuthService',
      [
        'hasValidAccessToken',
        'getIdentityClaims',
        'getAccessToken',
        'configure',
        'loadDiscoveryDocument',
        'initCodeFlow',
        'logOut',
        'tryLoginCodeFlow',
      ],
      {
        events: new Subject<any>(),
      },
    );

    TestBed.configureTestingModule({
      providers: [
        AuthenticationService,
        { provide: OAuthService, useValue: mockOAuthService },
      ],
    });
    service = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return identity claims from oauthService if available', () => {
    mockOAuthService.getIdentityClaims.and.returnValue({
      email: 'test@example.com',
      preferred_username: 'testuser',
    } as any);

    const claims = service.getIdentityClaims();
    expect(claims?.email).toBe('test@example.com');
  });

  it('should decode claims from access token if getIdentityClaims is null', () => {
    mockOAuthService.getIdentityClaims.and.returnValue(null as any);
    // JWT with payload {"email":"jwt@example.com","preferred_username":"jwtuser"}
    // header: {"alg":"none"} => eyJhbGciOiJub25lIn0
    // payload: eyJlbWFpbCI6Imp3dEBleGFtcGxlLmNvbSIsInByZWZlcnJlZF91c2VybmFtZSI6Imp3dHVzZXIifQ
    const fakeJwt =
      'eyJhbGciOiJub25lIn0.eyJlbWFpbCI6Imp3dEBleGFtcGxlLmNvbSIsInByZWZlcnJlZF91c2VybmFtZSI6Imp3dHVzZXIifQ.';
    mockOAuthService.getAccessToken.and.returnValue(fakeJwt);

    const claims = service.getIdentityClaims();
    expect(claims?.email).toBe('jwt@example.com');
    expect(claims?.preferred_username).toBe('jwtuser');
  });

  it('should return null when neither identity claims nor access token are available', () => {
    mockOAuthService.getIdentityClaims.and.returnValue(null as any);
    mockOAuthService.getAccessToken.and.returnValue('');

    const claims = service.getIdentityClaims();
    expect(claims).toBeNull();
  });
});
