import {Container} from 'typedi';
import {LoggerInstance} from 'winston';
import {LoggerFactory} from '../logger/LoggerFactory';
import {MySQLSource} from '../../datasource/MySQLSource';

export class TableDestroyer {
  private logger: LoggerInstance;

  public constructor() {
    this.logger = Container.get(LoggerFactory).get('TableDestroyer');
  }

  public async dropTable(dbSource: MySQLSource, tableName: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      this.logger.info(`dropping "${tableName}" table started...`);
      const connection = dbSource.poolConnection;
      connection.getConnection((err, conn) => {
        let sql: string;
        if (err) {
          reject(err);
        }
        sql = `DROP TABLE IF EXISTS ${tableName}`;
        conn.query(sql, (error) => {
          if (error) {
            reject(error);
          }
          this.logger.info(`dropping "${tableName}" table finished...`);
          conn.release();
          resolve();
        });
      });
    });
  }
}
