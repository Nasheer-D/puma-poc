import {Settings} from './settings.interface';
import * as winston from 'winston';

export class DefaultConfig {
  public static get settings(): Settings {
    return {
      apiPath:      '/api/v1',
      env:          process.env.NODE_ENV,
      host:         '0.0.0.0',
      morgan:       {},
      port:         '8080',
      winston:      {
        transports:  [
          new winston.transports.Console({
            level:            'debug',
            prettyPrint:      true,
            handleExceptions: true,
            json:             false,
            colorize:         true
          })
        ],
        exitOnError: false
      },
      serverSecret: 'sUp4hS3cr37kE9c0D3'
    };
  }
}
