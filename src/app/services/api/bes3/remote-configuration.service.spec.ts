import { TestBed } from '@angular/core/testing';

import { RemoteConfigurationService } from './remote-configuration.service';

describe('RemoteConfigurationService', () => {
  let service: RemoteConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoteConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
