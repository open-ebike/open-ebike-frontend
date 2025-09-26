import { TestBed } from '@angular/core/testing';

import { ReleaseManagementService } from './release-management.service';

describe('ReleaseManagementService', () => {
  let service: ReleaseManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReleaseManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
