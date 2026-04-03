import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlyoverControlsComponent } from './flyover-controls.component';

describe('FlyoverControlsComponent', () => {
  let component: FlyoverControlsComponent;
  let fixture: ComponentFixture<FlyoverControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlyoverControlsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlyoverControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
