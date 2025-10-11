import { TestBed } from '@angular/core/testing';

import { EbikeRegistrationService } from './ebike-registration.service';

describe('EbikeRegistrationService', () => {
  let service: EbikeRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EbikeRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
