import { Component, OnInit } from '@angular/core';
import { AccountDetails } from '../../models/AccountDetails';
import { AccountDetailsService } from '../../services/account-details.service';
import { HttpResponse } from '../../utils/web/models/HttpResponse';
import { User } from '../../models/User';
import { isSameWeek } from 'date-fns';
@Component({
  selector: 'app-account-balance-activity',
  templateUrl: './account-balance-activity.component.html',
  styleUrls: ['./account-balance-activity.component.css']
})
export class AccountBalanceActivityComponent implements OnInit {
  public details: AccountDetails[] = [];
  public sortingOption = '';
  isFiltered: boolean = false;
  byToday: boolean = false;
  byThisWeek: boolean = false;
  byThisMonth: boolean = false;
  byInterval: boolean = false;
  constructor(private detailsService: AccountDetailsService) { }
  public user: User;
  public userCredits: number;

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.userCredits = this.user.credits;
    this.detailsService.getAllTransactions(this.user.userID).subscribe((res: HttpResponse) => {
      if (res.success) {
        this.details = res.data;
        console.log(this.details);
      } else {
        alert(res.message);
      }
    });
  }

  public filterByToday() {
    this.byInterval = false;
    this.byThisMonth = false;
    this.byThisWeek = false;
    this.byToday = true;
    this.isFiltered = true;
    this.sortingOption = (Math.floor(Date.now() * 1000).toString()).slice(0, 5);
    console.log(this.sortingOption);
  }

  public filterByThisWeek() {
    this.byInterval = false;
    this.byThisMonth = false;
    this.byThisWeek = true;
    this.byToday = false;
    this.isFiltered = true;
    this.sortingOption = Math.floor(Date.now() / 1000).toString();
    console.log(isSameWeek(Date.now(), Date.now()));
  }

  public filterByInterval() {
    this.byInterval = true;
    this.byThisMonth = false;
    this.byThisWeek = false;
    this.byToday = false;
    this.isFiltered = true;
    this.sortingOption = Math.floor(Date.now() * 1000).toString();
  }

  public filterByThisMonth() {
    this.byInterval = false;
    this.byThisMonth = true;
    this.byThisWeek = false;
    this.byToday = false;
    this.isFiltered = true;
    this.sortingOption = Math.floor(Date.now() / 1000).toString();
  }
}
