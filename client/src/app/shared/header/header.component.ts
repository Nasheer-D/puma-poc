import { Component, OnInit } from '@angular/core';
import { User } from '../../models/User';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  public user: User;

  public ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    console.log('User:::', this.user);
  }
}
