import 'reflect-metadata';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as debug from 'debug';
import * as http from 'http';
import * as io from 'socket.io';
import * as YAML from 'yamljs';
import * as swaggerUi from 'swagger-ui-express';
import { useExpressServer, useContainer, RoutingControllersOptions } from 'routing-controllers';
import { Container } from 'typedi';
import { LoggerInstance } from 'winston';
import { LoggerFactory } from './utils/logger';
import { Config } from './config';
import { IDebugger } from 'debug';
import { Application } from 'express';
import { WebSocketHelper } from './utils/webSocket/webSocketHelper';

const swaggerDocument = YAML.load('./src/doc/api.yml');

class App {
  private loggerFactory: LoggerFactory = new LoggerFactory(Config.settings.winston, Config.settings.morgan);
  private logger: LoggerInstance = this.loggerFactory.getInstance('App');

  private debug: IDebugger = debug('app:main');

  public async run(): Promise<void> {
    this.debug('starting express app');
    const app: Application = express();
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));

    // parse application/json
    app.use(bodyParser.json());
    // allow CORS
    app.use(cors());
    app.use(this.loggerFactory.requestLogger);
    // swagger serve
    app.use('/api/v1/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    this.debug('dependency injection');
    useContainer(Container);
    Container.set(LoggerFactory, this.loggerFactory);

    const apiPath = Config.settings.apiPath;
    const routingControllersOptions: RoutingControllersOptions = {
      defaultErrorHandler: false,
      routePrefix: apiPath,
      controllers: [`${__dirname}${apiPath}/*.ts`]
    };

    this.debug('routing: %o', routingControllersOptions);
    useExpressServer(app, routingControllersOptions);

    //initialize a simple http server
    const server = new http.Server(app);
    //initialize the web socket server
    const webSocket = new WebSocketHelper().initiate(server);
    Container.set(io, webSocket);

    this.debug('listen');
    server.listen(Number(Config.settings.port), Config.settings.host);
    this.logger.info(`Visit API at ${Config.settings.host}:${Config.settings.port}${apiPath}`);

    process.on('unhandledRejection', (error: Error, promise: Promise<any>) => {
      this.logger.error('Unhandled rejection', error.stack);
    });
  }
}

new App().run().catch((error: Error) => {
  console.error('[!!!]', error.stack);
  process.exit(1);
});
