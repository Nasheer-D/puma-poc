import * as mysql from 'mysql';
import {LoggerInstance} from 'winston';
import {Container} from 'typedi';
import {LoggerFactory} from '../utils/logger/LoggerFactory';
import {DataSourceInterface} from './config/DataSource.interface';

export class MySQLSource {
  private logger: LoggerInstance;
  private _poolConnection: mysql.Pool;

  public constructor(private dbConfig: DataSourceInterface) {
    this.logger         = Container.get(LoggerFactory).get('MySQLSource');
    this.poolConnection = mysql.createPool({
      host:     this.dbConfig.host,
      port:     this.dbConfig.port,
      user:     this.dbConfig.user,
      password: this.dbConfig.password,
      database: this.dbConfig.database
    });
  }

  public get poolConnection(): mysql.Pool {
    return this._poolConnection;
  }

  public set poolConnection(value: mysql.Pool) {
    this._poolConnection = value;
  }
}
