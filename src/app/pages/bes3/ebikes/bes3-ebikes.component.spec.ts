import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bes3EbikesComponent } from './bes3-ebikes.component';

describe('Bes3EbikesComponent', () => {
  let component: Bes3EbikesComponent;
  let fixture: ComponentFixture<Bes3EbikesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bes3EbikesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Bes3EbikesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
