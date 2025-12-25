import { TestBed } from '@angular/core/testing';

import { Bes3AchievementService } from './bes3-achievement.service';

describe('AchievementService', () => {
  let service: Bes3AchievementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Bes3AchievementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
