import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bes2ActivitiesComponent } from './bes2-activities.component';

describe('ActivitiesComponent', () => {
  let component: Bes2ActivitiesComponent;
  let fixture: ComponentFixture<Bes2ActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bes2ActivitiesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Bes2ActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
