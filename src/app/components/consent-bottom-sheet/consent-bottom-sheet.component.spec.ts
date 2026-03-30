import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentBottomSheetComponent } from './consent-bottom-sheet.component';

describe('CookieBottomSheetComponent', () => {
  let component: ConsentBottomSheetComponent;
  let fixture: ComponentFixture<ConsentBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsentBottomSheetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsentBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
