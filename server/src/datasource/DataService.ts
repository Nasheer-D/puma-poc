// import * as mysql from 'mysql';
// import {MysqlError} from 'mysql';
import { LoggerFactory } from '../utils/logger/LoggerFactory';
import { Container } from 'typedi';
import { LoggerInstance } from 'winston';

export class DataService {
  private logger: LoggerInstance = Container.get(LoggerFactory).get('Request Error');

  public constructor(private connection: mysql.Pool) {

  }

  protected async executeQuery(sqlQuery: string, callback: any, values?: string[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.connection.getConnection(async (err, conn) => {
        if (err) {
          this.logger.error(err);
          reject(err);

          return;
        }

        await conn.query(sqlQuery, values, callback);
        this.connection.end((error) => {
          if (error) {
            reject(error);

            return;
          }
        });

        resolve();
      });
    });
  }

  public executeQueryAsPromise(query: string, values?: any[]): Promise<any> {
    const queryMessage: QueryMessage = {
      success: false,
      status: '',
      message: ''
    };

    return new Promise(async (resolve, reject) => {
      try {
        await this.executeQuery(query,
          (err: MysqlError, result) => {
            if (err) {
              queryMessage.status = 'FAILED';
              queryMessage.message = `SQL Query failed. Reason: ${err.message}`;
              queryMessage.errcode = err.code;

              resolve(queryMessage);
            } else if (result.length === 0) {
              queryMessage.status = 'NO DATA';
              queryMessage.message = `SQL Query returned no data from database.`;

              resolve(queryMessage);
            } else {
              queryMessage.success = true;
              queryMessage.status = 'OK';
              queryMessage.message = `SQL Query completed successful.`;
              queryMessage.data = result;

              resolve(queryMessage);
            }
          }, values);
      } catch (error) {
        reject(error);
      }

    });
  }

  public executeUpdateAsPromise(query: string, updateType: string, values?: any[]): Promise<any> {
    const updateMessage: UpdateMessage = {
      success: false,
      status: '',
      message: ''
    };

    return new Promise(async (resolve) => {
      await this.executeQuery(query,
        (err: MysqlError) => {
          if (err) {
            this.logger.error(`Error on '${updateType}'. Reason: ${err.message}`);
            updateMessage.status = 'FAILED';
            updateMessage.message = `Query for ${updateType} completed has failed. Reason: ${err.message}`;
            updateMessage.errcode = err.code;

            resolve(updateMessage);
          } else {
            updateMessage.success = true;
            updateMessage.status = 'OK';
            updateMessage.message = `Query for ${updateType} completed successful.`;

            resolve(updateMessage);
          }
        }, values);
    });
  }
}

export interface QueryMessage {
  success: boolean;
  status: string;
  message: string;
  data?: any;
  errcode?: string;
}

export interface UpdateMessage {
  success: boolean;
  status: string;
  message: string;
  errcode?: string;
}
