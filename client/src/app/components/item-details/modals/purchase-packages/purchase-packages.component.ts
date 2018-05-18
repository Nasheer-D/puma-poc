import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Package } from '../../../../models/Packages';
import { PackagesService } from '../../../../services/packages.service';
import { HttpResponse } from '../../../../utils/web/models/HttpResponse';


@Component({
  selector: 'app-purchase-packages',
  templateUrl: './purchase-packages.component.html',
  styleUrls: ['./purchase-packages.component.css']
})
export class PurchasePackagesComponent implements OnInit {
  @ViewChild('purchasePackages')
  public purchasePackages: NgbModal;
  public packages: Package[] = [];
  constructor(
    private modal: NgbModal,
    private packageService: PackagesService
  ) { }

  public ngOnInit(): void {
    this.packageService.getAllPackages().subscribe((res: HttpResponse) => {
      if (res.success) {
        this.packages = res.data;
        Object.keys(this.packages).forEach(key => {
          console.log(this.packages[key]);
        });
      } else {
        alert(res.message);
      }
    });
  }

  public open(): void {
    this.modal.open(this.purchasePackages, { centered: true, size: 'lg' });
  }
}
