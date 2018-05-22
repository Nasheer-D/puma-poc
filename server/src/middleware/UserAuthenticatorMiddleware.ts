import { ExpressMiddlewareInterface } from 'routing-controllers';
import * as jwt from 'jsonwebtoken';
import { JSONWebToken } from '../utils/authentication/JSONWebToken';
import { Config } from '../config';
import { AuthenticationResponse } from '../utils/authentication/ClientAuthenticator';

export class UserAuthenticatorMiddleware implements ExpressMiddlewareInterface {

  public use(request: any, response: any, next?: (err?: any) => any): any {
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');

    const token = JSONWebToken.GET_TOKEN_FROM_REQUEST(request);
    if (!token) {
      return this.failAuthentication(response, 'No token provided.');
    }

    jwt.verify(token, Config.settings.serverSecret, (err: any, decoded: any) => {
      if (err) {
        return this.failAuthentication(response, 'Failed to authenticate token.');
      }
      next();
    });
  }

  private failAuthentication(response: any, message: string): void {
    response.status(403).json(<AuthenticationResponse>{
      success: false,
      status: 'FAILED',
      message: message
    });
  }
}
