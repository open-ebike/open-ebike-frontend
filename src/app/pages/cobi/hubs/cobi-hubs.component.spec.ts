import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CobiHubsComponent } from './cobi-hubs.component';

describe('HubsComponent', () => {
  let component: CobiHubsComponent;
  let fixture: ComponentFixture<CobiHubsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CobiHubsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CobiHubsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
