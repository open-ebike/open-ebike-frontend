import { TestBed } from '@angular/core/testing';

import { Bes2YearlyAchievementService } from './bes2-yearly-achievement.service';

describe('Bes2YearlyAchievementService', () => {
  let service: Bes2YearlyAchievementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Bes2YearlyAchievementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
