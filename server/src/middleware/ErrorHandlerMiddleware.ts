import {Middleware, ExpressErrorMiddlewareInterface} from 'routing-controllers';
import {LoggerFactory} from '../utils/logger/LoggerFactory';
import {Container} from 'typedi';
import {LoggerInstance} from 'winston';

@Middleware({type: 'after'})
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  private logger: LoggerInstance = Container.get(LoggerFactory).getInstance('Request Error');

  public error(error: any, request: any, response: any, next: (err: any) => any): void {
    if (error.body && error.body.error) {
      error = error.body.error;
    }
    if (typeof error === 'string') {
      error = new Error(error);
    }
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    if (response && response.statusCode) {
      error.statusCode = response.statusCode;
    }

    response.status(error.statusCode).send({
      message: error.message
    });
  }
}
