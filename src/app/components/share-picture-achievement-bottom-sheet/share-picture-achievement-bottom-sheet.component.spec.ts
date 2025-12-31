import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharePictureAchievementBottomSheetComponent } from './share-picture-achievement-bottom-sheet.component';

describe('SharePictureAchievementBottomSheetComponent', () => {
  let component: SharePictureAchievementBottomSheetComponent;
  let fixture: ComponentFixture<SharePictureAchievementBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharePictureAchievementBottomSheetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      SharePictureAchievementBottomSheetComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
