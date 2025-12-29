import { TestBed } from '@angular/core/testing';

import { SharePictureService } from './share-picture.service';

describe('SharePictureService', () => {
  let service: SharePictureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharePictureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
