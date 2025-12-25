import { TestBed } from '@angular/core/testing';

import { WebShareService } from './web-share.service';

describe('WebShareService', () => {
  let service: WebShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
