import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../../services/registration.service';
import { IRegistrationDetails } from '../../models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  public username: string;
  public email: string;
  public walletAddress: string;
  public password: string;

  public constructor(private router: Router,
    private registrationService: RegistrationService) { }

  public registerUser(): void {
    const registrationDetails = <IRegistrationDetails>{
      username: this.username,
      email: this.email,
      password: this.password
    };
    this.registrationService.registerNewUser(registrationDetails).subscribe(result => {
      if (result) {
        this.router.navigate(['./login']);
      } else {
        alert(result);
      }
    });
  }
}
