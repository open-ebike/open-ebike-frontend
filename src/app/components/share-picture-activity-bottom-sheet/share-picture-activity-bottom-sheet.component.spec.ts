import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharePictureActivityBottomSheetComponent } from './share-picture-activity-bottom-sheet.component';

describe('ActivityImageBottomSheetComponent', () => {
  let component: SharePictureActivityBottomSheetComponent;
  let fixture: ComponentFixture<SharePictureActivityBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharePictureActivityBottomSheetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharePictureActivityBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
