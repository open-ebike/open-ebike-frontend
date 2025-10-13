import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bes2ComponentDetailsComponent } from './bes2-component-details.component';

describe('Bes2ComponentDetailsComponent', () => {
  let component: Bes2ComponentDetailsComponent;
  let fixture: ComponentFixture<Bes2ComponentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bes2ComponentDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Bes2ComponentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
