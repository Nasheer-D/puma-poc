import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentWalletComponent } from '../../../../components/item-details/modals/payment-wallet/payment-wallet.component';

@Component({
  selector: 'app-purchase-options',
  templateUrl: './purchase-options.component.html',
  styleUrls: ['./purchase-options.component.css']
})
export class PurchaseOptionsModalComponent {
  @ViewChild('purchaseOptionModal') purchaseOptionModal: NgbModal;
  @Input() itemPrice: number;
  @ViewChild('paymentWalletModal')
  public paymentWalletModal: PaymentWalletComponent;

  constructor(private modal: NgbModal) {}

  public open(): void {
    this.modal.open(this.purchaseOptionModal, { centered: true, size: 'lg' });
  }

  public openPaymentWalletModal() {
    this.paymentWalletModal.open();
  }
}
