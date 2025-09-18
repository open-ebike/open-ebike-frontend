import { TestBed } from '@angular/core/testing';

import { ActivityRecordsService } from './activity-records.service';

describe('ActivityRecordsService', () => {
  let service: ActivityRecordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityRecordsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
