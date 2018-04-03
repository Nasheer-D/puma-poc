import {LoggerOptions} from 'winston';
import {Options} from 'morgan';

export interface Settings {
  apiPath?: string;
  env?: string;
  host: string;
  morgan?: Options;
  port?: number | string;
  winston?: LoggerOptions;
  serverSecret: string;
}
