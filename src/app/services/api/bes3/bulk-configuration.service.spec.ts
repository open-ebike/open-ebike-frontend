import { TestBed } from '@angular/core/testing';

import { BulkConfigurationService } from './bulk-configuration.service';

describe('BulkConfigurationService', () => {
  let service: BulkConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BulkConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
