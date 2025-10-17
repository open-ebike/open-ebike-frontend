import { TestBed } from '@angular/core/testing';

import { DiagnosisEventService } from './diagnosis-event.service';

describe('DiagnosisEventService', () => {
  let service: DiagnosisEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiagnosisEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
