import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-purchase-packages',
  templateUrl: './purchase-packages.component.html',
  styleUrls: ['./purchase-packages.component.css']
})
export class PurchasePackagesComponent {
  @ViewChild('purchasePackages')
  public purchasePackages: NgbModal;

  constructor(private modal: NgbModal) { }

  public open(): void {
    this.modal.open(this.purchasePackages, { centered: true, size: 'lg' });
  }
}
