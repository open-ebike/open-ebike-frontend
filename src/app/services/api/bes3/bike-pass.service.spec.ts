import { TestBed } from '@angular/core/testing';

import { BikePassService } from './bike-pass.service';

describe('BikePassService', () => {
  let service: BikePassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BikePassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
