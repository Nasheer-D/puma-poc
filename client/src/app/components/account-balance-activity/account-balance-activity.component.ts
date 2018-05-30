import { Component, OnInit } from '@angular/core';
import { AccountDetails } from '../../models/AccountDetails';
import { AccountDetailsService } from '../../services/account-details.service';
import { HttpResponse } from '../../utils/web/models/HttpResponse';
import { User } from '../../models/User';


@Component({
  selector: 'app-account-balance-activity',
  templateUrl: './account-balance-activity.component.html',
  styleUrls: ['./account-balance-activity.component.css']
})
export class AccountBalanceActivityComponent implements OnInit {
  public details: AccountDetails[] = [];
  constructor(private detailsService: AccountDetailsService) { }
  public user: User;

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.detailsService.getAllTransactions(this.user.userID).subscribe((res: HttpResponse) => {
      if (res.success) {
        this.details = res.data;
      } else {
        alert(res.message);
      }
    });
  }
}
