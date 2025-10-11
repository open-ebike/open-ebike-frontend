import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { Bes3EbikesComponent } from './pages/bes3/ebikes/bes3-ebikes.component';
import { AuthGuard } from './services/auth/auth-guard';
import { Bes3EbikeDetailsComponent } from './pages/bes3/ebike-details/bes3-ebike-details.component';
import { Bes3ActivitiesComponent } from './pages/bes3/activities/bes3-activities.component';
import { Bes3RegistrationsComponent } from './pages/bes3/registrations/bes3-registrations.component';
import { Bes3ComponentDetailsComponent } from './pages/bes3/component-details/bes3-component-details.component';
import { LoginComponent } from './pages/login/login.component';
import { ImprintComponent } from './pages/imprint/imprint.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ConfigurationComponent } from './pages/configuration/configuration.component';
import { Bes2EbikesComponent } from './pages/bes2/ebikes/bes2-ebikes.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'bes3/ebike-details/:id',
    component: Bes3EbikeDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'bes3/ebikes',
    component: Bes3EbikesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'bes3/activities',
    component: Bes3ActivitiesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'bes3/registrations',
    component: Bes3RegistrationsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'bes3/component-details/:id',
    component: Bes3ComponentDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'bes2/ebikes',
    component: Bes2EbikesComponent,
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
