import { TestBed } from '@angular/core/testing';

import { RegionFinderService } from './region-finder.service';

describe('RegionFinderService', () => {
  let service: RegionFinderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegionFinderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
