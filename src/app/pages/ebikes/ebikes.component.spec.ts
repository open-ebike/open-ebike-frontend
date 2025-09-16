import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EbikesComponent } from './ebikes.component';

describe('EbikesComponent', () => {
  let component: EbikesComponent;
  let fixture: ComponentFixture<EbikesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EbikesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EbikesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
