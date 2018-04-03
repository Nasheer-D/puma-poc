import { Pool, QueryResult, Client } from 'pg';
import { LoggerFactory } from '../utils/logger/LoggerFactory';
import { Container } from 'typedi';
import { LoggerInstance } from 'winston';

export class DataService {
  private logger: LoggerInstance = Container.get(LoggerFactory).getInstance('DataService');

  protected async executeQuery(sqlQuery: ISqlQuery): Promise<any> {
    const pool: Pool = new Pool();
    pool.on('error', (error: Error, client: Client) => {
      this.logger.error(`Error On PG Pool. Reason: ${error}`);
    });

    return new Promise<any>(async (resolve: (res: any) => void, reject: (error: Error) => void) => {
      await pool.query(sqlQuery, (err: Error, res: QueryResult) => {
        pool.end();
        if (err) {
          this.logger.error(`Error Executing Query '${sqlQuery.text}'. Reason: ${err}`);
          reject(err);

          return;
        }
        resolve(res.rows[0]);
      });
    });
  }

  public executeQueryAsPromise(sqlQuery: ISqlQuery): Promise<any> {
    const queryMessage: IQueryMessage = {
      success: false,
      status: '',
      message: ''
    };

    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.executeQuery(sqlQuery);
        if (result.length === 0) {
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
      } catch (err) {
        queryMessage.status = 'FALED';
        queryMessage.message = `SQL Query failed. ${err}`;

        reject(queryMessage);
      }
    });
  }

  public executeUpdateAsPromise(sqlQuery: ISqlQuery, updateType: string): Promise<any> {
    const updateMessage: IUpdateMessage = {
      success: false,
      status: '',
      message: ''
    };

    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.executeQuery(sqlQuery);
        updateMessage.success = true;
        updateMessage.status = 'OK';
        updateMessage.message = `SQL Query completed successful.`;

        resolve(updateMessage);
      } catch (err) {
        updateMessage.status = 'FAILED';
        updateMessage.message = `Query for ${updateType} completed has failed. Reason: ${err.message}`;
        updateMessage.errcode = err.code;

        reject(updateMessage);
      }
    });
  }
}

export interface ISqlQuery {
  text: string;
  values?: any[];
}
export interface IQueryMessage {
  success: boolean;
  status: string;
  message: string;
  data?: any;
  errcode?: string;
}

export interface IUpdateMessage {
  success: boolean;
  status: string;
  message: string;
  errcode?: string;
}