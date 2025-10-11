import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bes3EbikeDetailsComponent } from './bes3-ebike-details.component';

describe('Bes3EbikeDetailsComponent', () => {
  let component: Bes3EbikeDetailsComponent;
  let fixture: ComponentFixture<Bes3EbikeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bes3EbikeDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Bes3EbikeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
