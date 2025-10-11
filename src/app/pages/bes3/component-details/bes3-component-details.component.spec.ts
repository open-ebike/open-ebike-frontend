import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bes3ComponentDetailsComponent } from './bes3-component-details.component';

describe('Bes3ComponentDetailsComponent', () => {
  let component: Bes3ComponentDetailsComponent;
  let fixture: ComponentFixture<Bes3ComponentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bes3ComponentDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Bes3ComponentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
