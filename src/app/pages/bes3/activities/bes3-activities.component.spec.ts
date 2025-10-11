import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bes3ActivitiesComponent } from './bes3-activities.component';

describe('Bes3ActivitiesComponent', () => {
  let component: Bes3ActivitiesComponent;
  let fixture: ComponentFixture<Bes3ActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bes3ActivitiesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Bes3ActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
