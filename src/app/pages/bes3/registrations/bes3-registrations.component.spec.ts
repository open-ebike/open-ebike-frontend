import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bes3RegistrationsComponent } from './bes3-registrations.component';

describe('Bes3RegistrationsComponent', () => {
  let component: Bes3RegistrationsComponent;
  let fixture: ComponentFixture<Bes3RegistrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bes3RegistrationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Bes3RegistrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
