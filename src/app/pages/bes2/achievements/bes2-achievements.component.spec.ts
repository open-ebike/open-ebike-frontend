import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bes2AchievementsComponent } from './bes2-achievements.component';

describe('AchievementsComponent', () => {
  let component: Bes2AchievementsComponent;
  let fixture: ComponentFixture<Bes2AchievementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bes2AchievementsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Bes2AchievementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
