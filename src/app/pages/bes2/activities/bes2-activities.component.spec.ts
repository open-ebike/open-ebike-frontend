import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { TranslocoTestingModule } from '@jsverse/transloco';

import { Bes2ActivitiesComponent } from './bes2-activities.component';

describe('ActivitiesComponent', () => {
  let component: Bes2ActivitiesComponent;
  let fixture: ComponentFixture<Bes2ActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Bes2ActivitiesComponent,
        TranslocoTestingModule.forRoot({
          langs: {},
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideOAuthClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Bes2ActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
