import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { User } from '../../models/User';
import { PurchasePackagesComponent } from '../../components/item-details/modals/purchase-packages/purchase-packages.component';
import { AuthenticationService } from '../../services/authentication.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('purchasePackages')
  public purchasePackagesComponent: PurchasePackagesComponent;
  public user: User;

  constructor(private authservice: AuthenticationService) {
  }

  public ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

  public showCreditModal() {
    this.purchasePackagesComponent.open();
  }

  public callLogoutFunction() {
    this.authservice.logout();
  }
}
