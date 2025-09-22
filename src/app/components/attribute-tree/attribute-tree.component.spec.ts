import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeTreeComponent } from './attribute-tree.component';

describe('AttributeTreeComponent', () => {
  let component: AttributeTreeComponent;
  let fixture: ComponentFixture<AttributeTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeTreeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AttributeTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
