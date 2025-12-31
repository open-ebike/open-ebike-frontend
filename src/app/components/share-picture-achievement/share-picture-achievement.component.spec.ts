import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharePictureAchievementComponent } from './share-picture-achievement.component';

describe('SharePictureAchievementComponent', () => {
  let component: SharePictureAchievementComponent;
  let fixture: ComponentFixture<SharePictureAchievementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharePictureAchievementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharePictureAchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
