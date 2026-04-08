import { TestBed } from '@angular/core/testing';

import { FlyOverRecordingService } from './fly-over-recording.service';

describe('FlyOverRecordingService', () => {
  let service: FlyOverRecordingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlyOverRecordingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
