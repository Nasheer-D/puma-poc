import { Component, OnInit } from '@angular/core';
import { Item } from '../../models/Item';
import { TransactionService } from '../../services/transaction.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: `app-item-details`,
  templateUrl: `./item-details.component.html`,
  styleUrls: [`./item-details.component.css`]
})
export class ItemDetailsComponent {
  public itemsDetails: Item = <Item>{
    itemID: `item01`,
    ownerID: `owner01`,
    title: `Item 01 Title`,
    description: `Item 01 Description`,
    price: 1000,
    size: 2100,
    licence: `standard`,
    itemUrl: `https://s3.amazonaws.com/pumapay-poc-items/pumapay03.jpg`,
    tags: [`puma`, ` ico`, ` crypto `],
    rating: [4, 3.5, 5],
    uploadedDate: 1522759457
  };

  public qrCodeAsString = '';
  public closeResult = '';

  public constructor(
    private txService: TransactionService,
    private modalService: NgbModal) {
  }

  private getTransactionData(amount) {
    console.log('getTransactionData', amount);

  }

  public open(content, amount) {
    console.log(content);
    this.txService.getTransactionData(amount).subscribe(res => {
      this.qrCodeAsString = JSON.stringify(res.data[0]);
      console.log(this.qrCodeAsString);
      this.modalService.open(content).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      });
    });
  }
}
