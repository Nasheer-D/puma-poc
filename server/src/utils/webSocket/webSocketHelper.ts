import * as http from 'http';
import * as WebSocket from 'ws';
import { LoggerInstance } from 'winston';
import { LoggerFactory } from '../../utils/logger';
import { Container } from 'typedi';
import { DataService, ISqlQuery } from '../../datasource/DataService';

export class WebSocketHelper {
    private logger: LoggerInstance = Container.get(LoggerFactory).getInstance('WebSocketHelper');
    private wss: WebSocket.Server;
    public initiate(server: http.Server): WebSocket.Server {
        this.wss = new WebSocket.Server({ server });

        this.wss.on('connection', (ws: WebSocket) => {
            this.logger.info('connected');
            ws.isAlive = true;

            ws.on('pong', () => {
                ws.isAlive = true;
            });

            //connection is up, let's add a simple simple event
            ws.on('message', async (sessionID: string) => {
                //log the received message and send it back to the client
                this.logger.info('received: %s', sessionID);
                const sqlQuery: ISqlQuery = {
                    text: 'SELECT * FROM sessions WHERE "sessionID" = $1',
                    values: [sessionID]
                };

                const queryResult = await new DataService().executeQueryAsPromise(sqlQuery);
                this.logger.info(JSON.stringify(queryResult));
                ws.send(JSON.stringify(queryResult.data[0]));
            });

            ws.on('close', () => {
                this.logger.info('disconnected');
            });
        });

        this.checkWsConnection(this.wss);

        return this.wss;
    }

    public async sendTxStatusForSession(sessionID: string): Promise<void> {
        this.logger.info('sending tx status');
        const sqlQuery: ISqlQuery = {
            text: 'SELECT * FROM sessions WHERE "sessionID" = $1',
            values: [sessionID]
        };

        const queryResult = await new DataService().executeQueryAsPromise(sqlQuery);
        this.logger.info(JSON.stringify(queryResult));
        this.wss.send(JSON.stringify(queryResult.data[0]));
        // this.wss.send()
    }

    private checkWsConnection(wss: WebSocket.Server) {
        setInterval(() => {
            wss.clients.forEach(ws => {
                if (ws.isAlive === false) {
                    this.logger.info('Connection Terminated');
                    return ws.terminate();
                }
                ws.isAlive = false;
                ws.ping();
            });
        }, 5000);
    }
}