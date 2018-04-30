import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { routing, appRoutingProviders } from './app.routing';

import { Constants } from './app.constants';
import { AuthGuard } from './guards/auth.guard';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ItemsComponent } from './components/items/items.component';

import { AuthenticationService } from './services/authentication.service';
import { HeaderComponent } from './shared/header/header.component';
import { ItemsService } from './services/items.service';
import { ItemDetailsComponent } from './components/item-details/item-details.component';
import { PurchaseOptionsModalComponent } from './components/item-details/modals/purchase-options/purchase-options.component';
import { PaymentWalletComponent } from './components/item-details/modals/payment-wallet/payment-wallet.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { OrderModule } from 'ngx-order-pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ItemsComponent,
    HeaderComponent,
    ItemDetailsComponent,
    PurchaseOptionsModalComponent,
    PaymentWalletComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    routing,
    NgbModule.forRoot(),
    NgxSpinnerModule,
    OrderModule
  ],
  providers: [
    appRoutingProviders,
    Constants,
    AuthenticationService,
    AuthGuard,
    ItemsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
