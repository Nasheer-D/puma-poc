import {Container} from 'typedi';
import {LoggerInstance} from 'winston';
import {LoggerFactory} from '../logger/LoggerFactory';
import {MySQLSource} from '../../datasource/MySQLSource';
import {DataSourceInterface} from '../../datasource/config/DataSource.interface';
import {DataPlacer} from './DataPlacer';
import {TableDestroyer} from './TableDestroyer';
import {TableCreator} from './TableCreator';

export class DBInitiator {
  private logger: LoggerInstance;
  private dbSource: MySQLSource;

  public constructor(private dbConfiguration: DataSourceInterface) {
    this.logger = Container.get(LoggerFactory).get('DBInitiator');
    try {
      this.dbSource = new MySQLSource(this.dbConfiguration);
    } catch (err) {
      this.logger.error(err);
    }
  }

  public async initiate(): Promise<void> {
    this.logger.info('Initiating DB');

    return new Promise<void>(async (resolve, reject) => {
      try {
        // DROP TABLES
        await new TableDestroyer().dropTable(this.dbSource, 'app_users');
        await new TableDestroyer().dropTable(this.dbSource, 'things');
        // CREATE TABLES
        await new TableCreator().createTables(this.dbSource);
        // INSERT DATA TO TABLES
        await new DataPlacer().insertData(this.dbSource);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

}
