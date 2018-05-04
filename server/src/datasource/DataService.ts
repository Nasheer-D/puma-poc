import { Pool, PoolClient } from 'pg';
import { LoggerFactory } from '../utils/logger/LoggerFactory';
import { Container } from 'typedi';
import { LoggerInstance } from 'winston';
import { DbErrorHelper } from '../utils/dbHelpers/dbErrorHelper';
import { IResponseMessage } from '../utils/responseHandler/ResponseHandler';

export class DataService {
  private logger: LoggerInstance = Container.get(LoggerFactory).getInstance('DataService');

  protected async executeQuery(sqlQuery: ISqlQuery): Promise<any> {
    const pool: Pool = new Pool();
    pool.on('error', (error: Error, client: PoolClient) => {
      this.logger.error(`Error On PG Pool. Reason: ${error}`);
    });

    return pool.query(sqlQuery);
  }

  public executeQueryAsPromise(sqlQuery: ISqlQuery): Promise<any> {
    const queryMessage: IResponseMessage = {
      success: false,
      status: '',
      message: ''
    };

    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.executeQuery(sqlQuery);
        if (result.rows.length === 0) {
          queryMessage.status = 'NO DATA';
          queryMessage.message = `SQL Query returned no data from database.`;

          resolve(queryMessage);
        } else {
          queryMessage.success = true;
          queryMessage.status = 'OK';
          queryMessage.message = `SQL Query completed successful.`;
          queryMessage.data = result.rows;

          resolve(queryMessage);
        }
      } catch (err) {
        const errorReason = DbErrorHelper.GET_DB_ERROR_CODES()[err.code] ? DbErrorHelper.GET_DB_ERROR_CODES()[err.code] : err.stack;
        queryMessage.status = 'FAILED';
        queryMessage.message = `SQL Query failed. Reason: ${errorReason}`;
        queryMessage.errcode = err.code;

        reject(queryMessage);
      }
    });
  }
}

export interface ISqlQuery {
  text: string;
  values?: any[];
}