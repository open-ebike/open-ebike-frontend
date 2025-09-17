import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbikeDetailsComponent } from './ebike-details.component';

describe('EbikeDetailsComponent', () => {
  let component: EbikeDetailsComponent;
  let fixture: ComponentFixture<EbikeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EbikeDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EbikeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
