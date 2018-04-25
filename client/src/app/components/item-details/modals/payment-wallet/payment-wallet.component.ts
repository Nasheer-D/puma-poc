import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-payment-wallet',
  templateUrl: './payment-wallet.component.html',
  styleUrls: ['./payment-wallet.component.css']
})
export class PaymentWalletComponent {
  @ViewChild('paymentWalletModal') paymentWalletModal: NgbModal;
  @Input() itemPrice2: number;

  constructor(private modal: NgbModal) {}

  public open(): void {
    this.modal.open(this.paymentWalletModal, { centered: true, size: 'lg' });
  }
}
