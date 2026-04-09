import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareFlyOverBottomSheetComponent } from './share-fly-over-bottom-sheet.component';

describe('ShareFlyOverBottomSheetComponent', () => {
  let component: ShareFlyOverBottomSheetComponent;
  let fixture: ComponentFixture<ShareFlyOverBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareFlyOverBottomSheetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShareFlyOverBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
