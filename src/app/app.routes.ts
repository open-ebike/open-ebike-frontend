import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { EbikesComponent } from './pages/ebikes/ebikes.component';
import { AuthGuard } from './services/auth/auth-guards';
import { EbikeDetailsComponent } from './pages/ebike-details/ebike-details.component';
import { ActivitiesComponent } from './pages/activities/activities.component';
import { RegistrationsComponent } from './pages/registrations/registrations.component';

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
    path: 'activities/:id',
    component: ActivitiesComponent,
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
  { path: '**', redirectTo: 'home' },
];
