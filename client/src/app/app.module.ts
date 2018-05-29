import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxSpinnerModule } from 'ngx-spinner';
import { OrderModule } from 'ngx-order-pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { Constants } from './app.constants';
import { AuthGuard } from './guards/auth.guard';
import { routing, appRoutingProviders } from './app.routing';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ItemsComponent } from './components/items/items.component';
import { ItemDetailsComponent } from './components/item-details/item-details.component';
import { PurchaseOptionsModalComponent } from './components/item-details/modals/purchase-options/purchase-options.component';
import { PaymentWalletModalComponent } from './components/item-details/modals/payment-wallet/payment-wallet.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { PaymentMetamaskComponent } from './components/item-details/modals/payment-metamask/payment-metamask.component';

import { AuthenticationService } from './services/authentication.service';
import { HeaderComponent } from './shared/header/header.component';
import { ItemsService } from './services/items.service';
import { TransactionService } from './services/transaction.service';
import { TxStatusService } from './services/webSocket.service';
import { Web3Service } from './services/web3.service';
import { PurchasePackagesComponent } from './components/item-details/modals/purchase-packages/purchase-packages.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { QrGeneratorService } from './services/qr-generator.service';
import { AccountBalanceActivityComponent } from './components/account-balance-activity/account-balance-activity.component';
import { PackagesService } from './services/packages.service';
import { RateService } from './services/rate.service';
import { UserService } from './services/users.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ItemsComponent,
    HeaderComponent,
    ItemDetailsComponent,
    PurchaseOptionsModalComponent,
    PaymentWalletModalComponent,
    LoadingSpinnerComponent,
    PaymentMetamaskComponent,
    PurchasePackagesComponent,
    SignUpComponent,
    AccountBalanceActivityComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    QRCodeModule,
    routing,
    NgxSpinnerModule,
    OrderModule,
    Ng2SearchPipeModule,
    NgbModule.forRoot()
  ],
  providers: [
    appRoutingProviders,
    Constants,
    AuthenticationService,
    AuthGuard,
    ItemsService,
    TransactionService,
    TxStatusService,
    Web3Service,
    QrGeneratorService,
    PackagesService,
    RateService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
