import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharePictureActivityComponent } from './share-picture-activity.component';

describe('ActivityImageComponent', () => {
  let component: SharePictureActivityComponent;
  let fixture: ComponentFixture<SharePictureActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharePictureActivityComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharePictureActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
