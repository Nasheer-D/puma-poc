import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NglModule } from 'ng-lightning/ng-lightning';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { routing, appRoutingProviders } from './app.routing';

import { Constants } from './app.constants';
import { AuthGuard } from './guards/auth.guard';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ItemsComponent } from './components/items/items.component';

import { ThingService } from './services/things.service';
import { AuthenticationService } from './services/authentication.service';
import { ThingDetailsComponent } from './components/thing-details/thing-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ItemsComponent,
    ThingDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    routing,
    NglModule.forRoot()
  ],
  providers: [
    appRoutingProviders,
    Constants,
    AuthenticationService,
    AuthGuard,
    ThingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
