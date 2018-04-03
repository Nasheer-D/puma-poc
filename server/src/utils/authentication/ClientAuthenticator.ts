import {LoggerInstance} from 'winston';
import {UserAuthenticator} from './UserAuthenticator';
import {MySQLSource} from '../../datasource/MySQLSource';
import {DataSourceConfig} from '../../datasource/config/DataSource.config';
import {DataService} from '../../datasource/DataService';

export class ClientAuthenticator {
  public constructor(private logger: LoggerInstance,
                     private username: string,
                     private password: string) {
  }

  public async authenticate(): Promise<AuthenticationResponse> {
    this.logger.debug('Login attempt with username: ', this.username);
    const connection = new MySQLSource(DataSourceConfig.configuration).poolConnection;

    try {
      const sqlQuery = `SELECT * FROM app_users where username = ?`;

      const queryResult = await new DataService(connection).executeQueryAsPromise(sqlQuery, [this.username]);
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
        token:   new UserAuthenticator().generateToken(queryResult.data[0]),
        user:    queryResult.data[0]
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
