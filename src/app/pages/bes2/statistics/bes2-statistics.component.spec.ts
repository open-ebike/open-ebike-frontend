import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bes2StatisticsComponent } from './bes2-statistics.component';

describe('StatisticsComponent', () => {
  let component: Bes2StatisticsComponent;
  let fixture: ComponentFixture<Bes2StatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bes2StatisticsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Bes2StatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
