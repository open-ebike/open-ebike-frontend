import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bes2YearlyAchievementsComponent } from './bes2-yearly-achievements.component';

describe('YearlyAchievementsComponent', () => {
  let component: Bes2YearlyAchievementsComponent;
  let fixture: ComponentFixture<Bes2YearlyAchievementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bes2YearlyAchievementsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Bes2YearlyAchievementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
