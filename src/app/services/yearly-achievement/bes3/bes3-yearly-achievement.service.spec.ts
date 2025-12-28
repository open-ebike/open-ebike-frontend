import { TestBed } from '@angular/core/testing';

import { Bes3YearlyAchievementService } from './bes3-yearly-achievement.service';

describe('Bes3YearlyAchievementService', () => {
  let service: Bes3YearlyAchievementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Bes3YearlyAchievementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
