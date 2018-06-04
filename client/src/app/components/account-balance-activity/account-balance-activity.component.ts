import { Component, OnInit } from '@angular/core';
import { AccountDetails } from '../../models/AccountDetails';
import { AccountDetailsService } from '../../services/account-details.service';
import { HttpResponse } from '../../utils/web/models/HttpResponse';
import { User } from '../../models/User';
import { isSameWeek, isSameMonth, isSameDay, isWithinRange, endOfMonth } from 'date-fns';
@Component({
  selector: 'app-account-balance-activity',
  templateUrl: './account-balance-activity.component.html',
  styleUrls: ['./account-balance-activity.component.css']
})
export class AccountBalanceActivityComponent implements OnInit {
  public details: AccountDetails[] = [];
  public filteredDetailsByToday: AccountDetails[] = [];
  public filteredDetailsByWeek: AccountDetails[] = [];
  public filteredDetailsByMonth: AccountDetails[] = [];
  public filterDetailsByInterval: AccountDetails[] = [];
  public startDate: number;
  public endDate: number;
  calendarVisible: boolean = false;
  byToday: boolean = false;
  byThisWeek: boolean = false;
  byThisMonth: boolean = false;
  byInterval: boolean = false;
  constructor(private detailsService: AccountDetailsService) { }
  public user: User;
  public userCredits: number;
  private i: number = 0;

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.userCredits = this.user.credits;
    this.detailsService.getAllTransactions(this.user.userID).subscribe((res: HttpResponse) => {
      if (res.success) {
        this.details = res.data;
      } else {
        alert(res.message);
      }
    });
  }

  public filterByToday() {
    this.i = 0;
    if (this.byToday === false) {
      this.byInterval = false;
      this.byThisMonth = false;
      this.byThisWeek = false;
      this.byToday = true;
      Object.keys(this.details).forEach(key => {
        if ((isSameDay(Date.now(), (this.details[key].date))) === true) {
          this.filteredDetailsByToday[this.i] = this.details[key];
          this.i = this.i + 1;
        }
      });
    } else if (this.byToday === true) {
      this.byToday = false;
    }
  }

  public filterByThisWeek() {
    this.i = 0;
    if (this.byThisWeek === false) {
      this.byInterval = false;
      this.byThisMonth = false;
      this.byThisWeek = true;
      this.byToday = false;
      Object.keys(this.details).forEach(key => {
        if ((isSameWeek(Date.now(), (this.details[key].date), { weekStartsOn: 1 })) === true) {
          this.filteredDetailsByWeek[this.i] = this.details[key];
          this.i = this.i + 1;
        }
      });
    } else if (this.byThisWeek === true) {
      this.byThisWeek = false;
    }
  }

  public filterByThisMonth() {
    this.i = 0;
    if (this.byThisMonth === false) {
      this.byInterval = false;
      this.byThisMonth = true;
      this.byThisWeek = false;
      this.byToday = false;
      Object.keys(this.details).forEach(key => {
        if ((isSameMonth(Date.now(), (this.details[key].date))) === true) {
          this.filteredDetailsByMonth[this.i] = this.details[key];
          this.i = this.i + 1;
        }
      });
    } else if (this.byThisMonth === true) {
      this.byThisMonth = false;
    }
  }

  public filterByInterval() {
    this.i = 0;
    this.filterDetailsByInterval = [];
    Object.keys(this.details).forEach(key => {
      if ((isWithinRange(this.details[key].date, this.startDate, this.endDate)) === true) {
        this.filterDetailsByInterval[this.i] = this.details[key];
        this.i = this.i + 1;
      }
    });
    if (this.filterDetailsByInterval.length > 0) {
      this.byInterval = true;
    }
  }

  public showCalendar() {
    if (this.byInterval === false && this.calendarVisible === false) {
      this.calendarVisible = true;
      this.byThisMonth = false;
      this.byThisWeek = false;
      this.byToday = false;
    } else if (this.byInterval === true || this.calendarVisible === true) {
      this.byInterval = false;
      this.calendarVisible = false;
    }
  }
}
