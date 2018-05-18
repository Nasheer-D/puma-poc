import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public username: string;
  public password: string;

  public constructor(private router: Router,
    private authenticationService: AuthenticationService) {
  }

  public ngOnInit(): void {
    // reset login status
    this.authenticationService.logout();
  }

  public login() {
    this.authenticationService.login(this.username, this.password)
      .subscribe(result => {
        if (result) {
          this.router.navigate(['./things']);
        } else {
          alert(result.message);
        }
      });
  }
}
