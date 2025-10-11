import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bes2EbikesComponent } from './bes2-ebikes.component';

describe('EbikesComponent', () => {
  let component: Bes2EbikesComponent;
  let fixture: ComponentFixture<Bes2EbikesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bes2EbikesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Bes2EbikesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
