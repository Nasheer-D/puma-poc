import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { ThingsComponent } from './components/things/things.component';
import { ThingDetailsComponent } from './components/thing-details/thing-details.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'things', component: ThingsComponent, canActivate: [AuthGuard] },
  { path: 'thing-details/:thingID', component: ThingDetailsComponent, canActivate: [AuthGuard] },

  // otherwise redirect to login
  { path: '**', redirectTo: 'login' }
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
