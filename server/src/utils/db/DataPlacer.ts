import { Container } from 'typedi';
import { LoggerInstance } from 'winston';
import { LoggerFactory } from '../logger/LoggerFactory';
import { MySQLSource } from '../../datasource/MySQLSource';
import { IUserTestData } from '../../domain/users/models/User';
import { IThing } from '../../domain/things/models/Thing';
import { User } from '../../domain/users/models/User';

export class DataPlacer {
  private logger: LoggerInstance;

  public constructor() {
    this.logger = Container.get(LoggerFactory).get('DataPlacer');
  }

  public async insertData(dbSource: MySQLSource): Promise<void> {
    const testData = require('../../../resources/test_data.json');
    await this.insertUsersData(dbSource, testData.users);
    await this.insertThingsData(dbSource, testData.things);
  }

  private async insertUsersData(dbSource: MySQLSource, data: IUserTestData[]): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      this.logger.info('inserting data into "app_users" table...');
      const connection = dbSource.poolConnection;

      const usersData = [];
      data.forEach((item: IUserTestData) => {
        const user = new User(item.userID, item.password, item.role);
        usersData.push([user.userID, user.username, user.salt, user.hash, user.role]);
      });
      connection.getConnection((err, conn) => {
        if (err) {
          reject(err);
        }

        const sql = 'INSERT INTO app_users VALUES ?';
        conn.query(sql, [usersData], (error) => {
          if (error) {
            reject(error);
          }
          this.logger.info('data import to "app_users" table finished...');
          conn.release();
          resolve();
        });
      });
    });
  }

  private async insertThingsData(dbSource: MySQLSource, data: IThing[]): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      this.logger.info('inserting data into "things" table...');
      const connection = dbSource.poolConnection;

      const thingsData = [];
      data.forEach((thing) => {
        thingsData.push([thing.thingID, thing.description]);
      });
      connection.getConnection((err, conn) => {
        if (err) {
          reject(err);
        }

        const sql = 'INSERT INTO things VALUES ?';
        conn.query(sql, [thingsData], (error) => {
          if (error) {
            reject(error);
          }
          this.logger.info('data import to "things" table finished...');
          conn.release();
          resolve();
        });
      });
    });
  }
}
