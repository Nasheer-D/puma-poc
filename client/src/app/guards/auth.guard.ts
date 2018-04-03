import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(
    private router: Router,
    private authService: AuthenticationService) {}

  public canActivate() {
    if (!this.authService.isTokenExpired()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
