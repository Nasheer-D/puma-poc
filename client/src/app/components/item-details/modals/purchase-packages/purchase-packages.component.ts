import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Package } from '../../../../models/Packages';
import { PackagesService } from '../../../../services/packages.service';
import { RateService } from '../../../../services/rate.service';
import { HttpResponse } from '../../../../utils/web/models/HttpResponse';
import { AuthenticationService } from '../../../../services/authentication.service';


@Component({
  selector: 'app-purchase-packages',
  templateUrl: './purchase-packages.component.html',
  styleUrls: ['./purchase-packages.component.css']
})
export class PurchasePackagesComponent implements OnInit {
  @ViewChild('purchasePackages')
  public purchasePackages: NgbModal;
  public packages: Package[] = [];
  public rate: number;
  constructor(
    private modal: NgbModal,
    private authService: AuthenticationService,
    private packageService: PackagesService,
    public rateService: RateService
  ) { }

  public ngOnInit(): void {
    if (!this.authService.isTokenExpired()) {
      this.rateService.getPMAtoUSDRate().subscribe((res: HttpResponse) => {
        if (res.success) {
          this.rate = res.data[0].rate;
          this.packageService.getAllPackages().subscribe((ressponse: HttpResponse) => {
            if (ressponse.success) {
              this.packages = ressponse.data;
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
    this.modal.open(this.purchasePackages, { centered: true, size: 'lg' });
  }
}
