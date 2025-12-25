import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharingBottomSheetComponent } from './sharing-bottom-sheet.component';

describe('SharingBottomSheetComponent', () => {
  let component: SharingBottomSheetComponent;
  let fixture: ComponentFixture<SharingBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharingBottomSheetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharingBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
