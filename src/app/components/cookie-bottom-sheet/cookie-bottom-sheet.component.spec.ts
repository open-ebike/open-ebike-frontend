import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieBottomSheetComponent } from './cookie-bottom-sheet.component';

describe('CookieBottomSheetComponent', () => {
  let component: CookieBottomSheetComponent;
  let fixture: ComponentFixture<CookieBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookieBottomSheetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CookieBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
