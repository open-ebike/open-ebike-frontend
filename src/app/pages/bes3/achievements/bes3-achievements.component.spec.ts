import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bes3AchievementsComponent } from './bes3-achievements.component';

describe('AchievementsComponent', () => {
  let component: Bes3AchievementsComponent;
  let fixture: ComponentFixture<Bes3AchievementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bes3AchievementsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Bes3AchievementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
