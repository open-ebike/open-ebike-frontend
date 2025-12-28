import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bes3YearlyAchievementsComponent } from './bes3-yearly-achievements.component';

describe('YearlyAchievementsComponent', () => {
  let component: Bes3YearlyAchievementsComponent;
  let fixture: ComponentFixture<Bes3YearlyAchievementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bes3YearlyAchievementsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Bes3YearlyAchievementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
