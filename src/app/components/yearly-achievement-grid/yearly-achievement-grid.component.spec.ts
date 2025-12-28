import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyAchievementGridComponent } from './yearly-achievement-grid.component';

describe('YearlyAchievementGridComponent', () => {
  let component: YearlyAchievementGridComponent;
  let fixture: ComponentFixture<YearlyAchievementGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearlyAchievementGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(YearlyAchievementGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
