import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyAchievementCarouselComponent } from './yearly-achievement-carousel.component';

describe('YearlyAchievementCarouselComponent', () => {
  let component: YearlyAchievementCarouselComponent;
  let fixture: ComponentFixture<YearlyAchievementCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearlyAchievementCarouselComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(YearlyAchievementCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
