import { DataSourceInterface } from './DataSource.interface';

export class DataSourceConfig {
  public static get configuration(): DataSourceInterface {
    return {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      charset: 'utf8'
    };
  }
}
