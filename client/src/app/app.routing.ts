import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { ItemsComponent } from './components/items/items.component';
import { ItemDetailsComponent } from './components/item-details/item-details.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: `items`, component: ItemsComponent },
  { path: `item/:itemID`, component: ItemDetailsComponent },

  // otherwise redirect to login
  { path: `**`, redirectTo: `items` }
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
