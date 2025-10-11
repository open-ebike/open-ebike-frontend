import { TestBed } from '@angular/core/testing';

import { EbikeProfileService } from './ebike-profile.service';

describe('EbikeProfileService', () => {
  let service: EbikeProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EbikeProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
