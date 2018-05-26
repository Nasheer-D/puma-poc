import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreditPackage } from '../../../../models/Packages';
import { PackagesService } from '../../../../services/packages.service';
import { RateService } from '../../../../services/rate.service';
import { HttpResponse } from '../../../../utils/web/models/HttpResponse';
import { AuthenticationService } from '../../../../services/authentication.service';
import { PurchaseOptionsModalComponent } from '../purchase-options/purchase-options.component';
import { TransactionService } from '../../../../services/transaction.service';

@Component({
  selector: 'app-purchase-packages',
  templateUrl: './purchase-packages.component.html',
  styleUrls: ['./purchase-packages.component.css']
})
export class PurchasePackagesComponent implements OnInit {
  @ViewChild('purchasePackages')
  public purchasePackages: NgbModal;
  @ViewChild('purchaseOptionModal')
  public purchaseOptionsModal: PurchaseOptionsModalComponent;

  public creditPackages: CreditPackage[] = [];
  public selectedPackage: CreditPackage = <CreditPackage>{};
  public rate: number;
  constructor(
    private modal: NgbModal,
    private authService: AuthenticationService,
    private packageService: PackagesService,
    public rateService: RateService,
    private transactionService: TransactionService
  ) { }

  public ngOnInit(): void {
    if (!this.authService.isTokenExpired()) {
      this.rateService.getPMAtoUSDRate().subscribe((res: HttpResponse) => {
        if (res.success) {
          this.rate = res.data[0].rate;
          this.packageService.getAllPackages().subscribe((ressponse: HttpResponse) => {
            if (ressponse.success) {
              this.creditPackages = ressponse.data;
            } else {
              alert(ressponse.message);
            }
          });
        } else {
          alert(res.message);
        }
      });
    }
  }

  public open(): void {
    this.transactionService.initiateTransactionSession().subscribe((res: HttpResponse) => {
      localStorage.setItem('sessionID', res.data[0].sessionID);
    });

    this.modal.open(this.purchasePackages, { centered: true, size: 'lg' }).result.then((result) => {
      this.clearLocalStorage();
    }, (dismissReason) => {
      this.clearLocalStorage();
    });
  }

  public openPuchaseOptionsModal(creditPackage: CreditPackage): void {
    localStorage.setItem('packageID', creditPackage.packageID);
    this.selectedPackage = creditPackage;
    this.purchaseOptionsModal.open();
  }

  private clearLocalStorage(): void {
    localStorage.removeItem('sessionID');
    localStorage.removeItem('packageID');
  }
}
