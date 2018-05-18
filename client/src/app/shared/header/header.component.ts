import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../models/User';
import { PurchasePackagesComponent } from '../../components/item-details/modals/purchase-packages/purchase-packages.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('purchasePackages')
  public purchasePackages: PurchasePackagesComponent;
  public user: User;

  public ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }
  public showCreditModal() {
    this.purchasePackages.open();
  }
}
