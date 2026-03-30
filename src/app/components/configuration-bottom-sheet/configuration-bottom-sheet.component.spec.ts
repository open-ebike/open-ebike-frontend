import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationBottomSheetComponent } from './configuration-bottom-sheet.component';

describe('ConfigurationBottomSheetComponent', () => {
  let component: ConfigurationBottomSheetComponent;
  let fixture: ComponentFixture<ConfigurationBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurationBottomSheetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigurationBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
