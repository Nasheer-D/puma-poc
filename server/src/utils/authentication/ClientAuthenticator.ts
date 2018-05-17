import { LoggerInstance } from 'winston';
import { UserAuthenticator } from './UserAuthenticator';
import { DataSourceConfig } from '../../datasource/config/DataSource.config';
import { DataService, ISqlQuery } from '../../datasource/DataService';

export class ClientAuthenticator {
  public constructor(private logger: LoggerInstance,
    private username: string,
    private password: string) {
  }

  public async authenticate(): Promise<AuthenticationResponse> {
    this.logger.debug('Login attempt with username: ', this.username);

    try {
      const sqlQuery: ISqlQuery = {
        text: `SELECT * FROM app_users where "userName" = $1`,
        values: [this.username]
      };

      const queryResult = await new DataService().executeQueryAsPromise(sqlQuery);
      if (!new UserAuthenticator().validPassword(queryResult.data[0], this.password)) {
        return <AuthenticationResponse>{
          success: false,
          message: 'Password is incorrect.',
          errcode: 'WRONG_PASS'
        };
      }

      return <AuthenticationResponse>{
        success: true,
        message: `Succesful login for user: ` + this.username,
        token: new UserAuthenticator().generateToken(queryResult.data[0]),
        user: queryResult.data[0]
      };
    } catch (error) {
      if (error.message === 'Cannot read property \'0\' of undefined') {
        return <AuthenticationResponse>{
          success: false,
          message: 'User does not exists.',
          errcode: 'NO_USER'
        };
      } else {
        return <AuthenticationResponse>{
          success: false,
          message: error.message,
          errcode: error.code ? error.code : 'NO_CODE'
        };
      }
    }
  }
}

export interface AuthenticationResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: any;
  errcode?: string;
}
