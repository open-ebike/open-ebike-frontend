import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchievementGridComponent } from './achievement-grid.component';

describe('AchievementGridComponent', () => {
  let component: AchievementGridComponent;
  let fixture: ComponentFixture<AchievementGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchievementGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AchievementGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
