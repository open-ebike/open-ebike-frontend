import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeatmapComponent } from './heatmap.component';

describe('HeatmapComponent', () => {
  let component: HeatmapComponent;
  let fixture: ComponentFixture<HeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeatmapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate weeks correctly', () => {
    const data = [
      { date: '2023-01-01', value: 1000 },
      { date: '2023-01-02', value: 2000 },
    ];
    fixture.componentRef.setInput('data', data);
    fixture.componentRef.setInput('year', 2023);
    fixture.detectChanges();

    const weeks = component.weeks();
    expect(weeks.length).toBeGreaterThan(0);
    // Check if data is mapped
    const day1 = weeks.flat().find((d: any) => d.date === '2023-01-01');
    expect(day1).toBeDefined();
    expect(day1?.value).toBe(1000);
  });
});
