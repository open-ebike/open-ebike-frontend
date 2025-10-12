import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bes2EbikeDetailsComponent } from './bes2-ebike-details.component';

describe('EbikeDetailsComponent', () => {
  let component: Bes2EbikeDetailsComponent;
  let fixture: ComponentFixture<Bes2EbikeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bes2EbikeDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Bes2EbikeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
