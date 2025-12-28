import { TestBed } from '@angular/core/testing';

import { YearlyAchievementService } from './yearly-achievement.service';

describe('YearlyAchievementService', () => {
  let service: YearlyAchievementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YearlyAchievementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
