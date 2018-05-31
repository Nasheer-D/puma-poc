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
    if (this.byToday === false) {
      this.byInterval = false;
      this.byThisMonth = false;
      this.byThisWeek = false;
      this.byToday = true;
      Object.keys(this.details).forEach(key => {
        if ((isSameDay(Date.now(), (this.details[key].date))) === true) {
          this.filteredDetailsByToday[key] = this.details[key];
        }
      });
    } else if (this.byToday === true) {
      this.byToday = false;
    }
  }

  public filterByThisWeek() {
    if (this.byThisWeek === false) {
      this.byInterval = false;
      this.byThisMonth = false;
      this.byThisWeek = true;
      this.byToday = false;
      Object.keys(this.details).forEach(key => {
        if ((isSameWeek(Date.now(), (this.details[key].date), { weekStartsOn: 0 })) === true) {
          this.filteredDetailsByWeek[key] = this.details[key];
        }
      });
    } else if (this.byThisWeek === true) {
      this.byThisWeek = false;
    }
  }

  public filterByThisMonth() {
    if (this.byThisMonth === false) {
      this.byInterval = false;
      this.byThisMonth = true;
      this.byThisWeek = false;
      this.byToday = false;
      Object.keys(this.details).forEach(key => {
        if ((isSameMonth(Date.now(), (this.details[key].date))) === true) {
          this.filteredDetailsByMonth[key] = this.details[key];
        }
      });
    } else if (this.byThisMonth === true) {
      this.byThisMonth = false;
    }
  }

  public filterByInterval() {
    Object.keys(this.details).forEach(key => {
      if ((isWithinRange(this.details[key].date, this.startDate, this.endDate)) === true) {
        this.filterDetailsByInterval[key] = this.details[key];
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
      console.log('dhould');
      this.byInterval = false;
      this.calendarVisible = false;
    }
  }
}
