import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CobiActivitiesComponent } from './cobi-activities.component';

describe('ActivitiesComponent', () => {
  let component: CobiActivitiesComponent;
  let fixture: ComponentFixture<CobiActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CobiActivitiesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CobiActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
