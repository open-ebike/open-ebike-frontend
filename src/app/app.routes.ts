import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ImprintComponent } from './pages/imprint/imprint.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
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
