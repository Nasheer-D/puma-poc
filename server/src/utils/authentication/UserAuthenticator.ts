import {Password} from './Password';
import {Config} from '../../config';
import * as jsonwebtoken from 'jsonwebtoken';
import {User} from '../../domain/users/models/User';

export class UserAuthenticator {
  private TOKEN_LIFETIME_IN_SECONDS: number = 24 * 60 * 60; // 24 hours

  public validPassword(user: User, password: string): boolean {
    return new Password(password, user.salt).toHash() === user.hash;
  }

  public generateToken(user: User): string {
    return jsonwebtoken.sign(user, Config.settings.serverSecret, {
      expiresIn: this.TOKEN_LIFETIME_IN_SECONDS
    });
  }

  public getTokenPayload(token: string) {
    return jsonwebtoken.decode(token);
  }
}
