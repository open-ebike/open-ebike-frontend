import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharePictureComponent } from './share-picture.component';

describe('SharePictureComponent', () => {
  let component: SharePictureComponent;
  let fixture: ComponentFixture<SharePictureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharePictureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharePictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
