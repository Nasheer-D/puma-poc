import {Container} from 'typedi';
import {LoggerInstance} from 'winston';
import {LoggerFactory} from '../logger/LoggerFactory';
import {MySQLSource} from '../../datasource/MySQLSource';
import {DataSourceInterface} from '../../datasource/config/DataSource.interface';

export class TableCreator {
  private logger: LoggerInstance;

  public constructor() {
    this.logger = Container.get(LoggerFactory).get('TableCreator');
    }

  public async createTables(dbSource: MySQLSource): Promise<void> {
    await this.createUsersTable(dbSource);
    await this.createThingsTable(dbSource);
  }

  private async createUsersTable(dbSource: MySQLSource): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      this.logger.info('creating "app_users" table...');
      const connection = dbSource.poolConnection;
      connection.getConnection((err, conn) => {
        if (err) {
          reject(err);
        }

        const sql = `CREATE TABLE IF NOT EXISTS app_users (userID char(10), username char(25), salt char(32), hash char(128), role varchar(10), PRIMARY KEY (userID))`;

        conn.query(sql, (error) => {
          if (error) {
            reject(error);
          }
          this.logger.info('"app_users" table created...');
          conn.release();
          resolve();
        });
      });
    });
  }

  private async createThingsTable(dbSource: MySQLSource): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      this.logger.info('creating "things" table...');
      const connection = dbSource.poolConnection;
      connection.getConnection((err, conn) => {
        if (err) {
          reject(err);
        }

        const sql = `CREATE TABLE IF NOT EXISTS things (thingID char(10), description varchar(125), PRIMARY KEY (thingID))`;

        conn.query(sql, (error) => {
          if (error) {
            reject(error);
          }
          this.logger.info('"things" table created...');
          conn.release();
          resolve();
        });
      });
    });
  }
}
