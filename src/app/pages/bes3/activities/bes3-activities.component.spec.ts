import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { TranslocoTestingModule } from '@jsverse/transloco';

import { Bes3ActivitiesComponent } from './bes3-activities.component';

describe('Bes3ActivitiesComponent', () => {
  let component: Bes3ActivitiesComponent;
  let fixture: ComponentFixture<Bes3ActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Bes3ActivitiesComponent,
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

    fixture = TestBed.createComponent(Bes3ActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
