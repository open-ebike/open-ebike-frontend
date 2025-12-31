import { TestBed } from '@angular/core/testing';

import { MapillaryService } from './mapillary.service';

describe('MapillaryService', () => {
  let service: MapillaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapillaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
