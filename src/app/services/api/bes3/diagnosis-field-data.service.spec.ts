import { TestBed } from '@angular/core/testing';

import { DiagnosisFieldDataService } from './diagnosis-field-data.service';

describe('DiagnosisFieldDataService', () => {
  let service: DiagnosisFieldDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiagnosisFieldDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
