import { TestBed } from '@angular/core/testing';

import { Bes2AchievementService } from './bes2-achievement.service';

describe('AchievementService', () => {
  let service: Bes2AchievementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Bes2AchievementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
