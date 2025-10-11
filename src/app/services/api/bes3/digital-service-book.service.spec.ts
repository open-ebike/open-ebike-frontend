import { TestBed } from '@angular/core/testing';

import { DigitalServiceBookService } from './digital-service-book.service';

describe('DigitalServiceBookService', () => {
  let service: DigitalServiceBookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DigitalServiceBookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
