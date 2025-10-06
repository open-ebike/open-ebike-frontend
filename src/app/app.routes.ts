import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { EbikesComponent } from './pages/ebikes/ebikes.component';
import { AuthGuard } from './services/auth/auth-guard';
import { EbikeDetailsComponent } from './pages/ebike-details/ebike-details.component';
import { ActivitiesComponent } from './pages/activities/activities.component';
import { RegistrationsComponent } from './pages/registrations/registrations.component';
import { ComponentDetailsComponent } from './pages/component-details/component-details.component';
import { LoginComponent } from './pages/login/login.component';
import { ImprintComponent } from './pages/imprint/imprint.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ConfigurationComponent } from './pages/configuration/configuration.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'ebike-details/:id',
    component: EbikeDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'ebikes',
    component: EbikesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'activities',
    component: ActivitiesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'registrations',
    component: RegistrationsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'component-details/:id',
    component: ComponentDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'configuration',
    component: ConfigurationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
  {
    path: 'imprint',
    component: ImprintComponent,
  },
  { path: '**', redirectTo: 'home' },
];
