import { DataSourceInterface } from './DataSource.interface';

export class DataSourceConfig {
  public static get configuration(): DataSourceInterface {
    return {
      user: process.env.PGUSER_IO,
      host: process.env.PGHOST_IO,
      database: process.env.PGDATABASE_IO,
      password: process.env.PGPASSWORD_IO,
      port: Number(process.env.PGPORT_IO)
    };
  }
}
