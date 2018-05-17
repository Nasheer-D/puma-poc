import { JsonController, Body, Res, Param, Get, Put, QueryParam } from 'routing-controllers';
import { LoggerInstance } from 'winston';
import { LoggerFactory } from '../../utils/logger';
import { Container } from 'typedi';
import { v1 } from 'uuid';

import {
  IResponseMessage,
  ResponseHandler
} from '../../utils/responseHandler/ResponseHandler';
import {
  TransactionBuilder,
  Transaction
} from '../../domain/transactions/models/Transaction';
import { ISqlQuery, DataService } from '../../datasource/DataService';
import { Session, TxStatus } from '../../domain/sessions/models/Session';
import { Globals } from '../../globals';
import * as io from 'socket.io';

const Web3 = require('web3'); // tslint:disable-line

@JsonController('/transaction')
export class TransactionController {
  private logger: LoggerInstance = Container.get(LoggerFactory).getInstance('TransactionController');
  private webSocket: io = Container.get(io);

  @Get('/init/')
  public async initiateTransactionWithSessionID(@Res() response: any) {
    try {
      const sessionStoredResult = await new Session().storeSessionID(v1());
      return new ResponseHandler().handle(response, sessionStoredResult);
    } catch (err) {
      return new ResponseHandler().handle(response, err);
    }
  }

  @Get('/tx/:sessionID/:itemID')
  public async retrieveTransactionData(@Param('sessionID') sessionID: string, @Param('itemID') itemID: string, @Res() response: any) {
    this.logger.info('Retrieving Transaction Data for Item');
    const sqlQuery: ISqlQuery = {
      text: `SELECT price, description, title, "walletAddress"
            FROM items INNER JOIN app_users ON "ownerID" = "userID" WHERE "itemID" = $1;`,
      values: [itemID]
    };

    try {
      const queryResult = await new DataService().executeQueryAsPromise(sqlQuery);
      if (!queryResult.success) {
        return new ResponseHandler().handle(response, queryResult);
      }

      const transactionBuilder = new TransactionBuilder();
      transactionBuilder.description = queryResult.data[0].description;
      transactionBuilder.name = queryResult.data[0].title;
      transactionBuilder.to = queryResult.data[0].walletAddress;
      transactionBuilder.value = queryResult.data[0].price;

      transactionBuilder.callbackUrl =
        `${Globals.GET_BACKEND_HOST()}${Globals.GET_API_PREFIX()}transaction/txStatus/session/${sessionID}`;

      const transaction: Transaction = transactionBuilder.build();
      const responseMessage: IResponseMessage = {
        success: true,
        status: 'OK',
        message: 'Retrieved transaction data succesfully',
        data: [transaction.toJSON()]
      };

      return new ResponseHandler().handle(response, responseMessage);
    } catch (err) {
      return new ResponseHandler().handle(response, err);
    }
  }

  @Get('/tx/plain/:sessionID/:itemID')
  public async retrieveTransaction(@Param('sessionID') sessionID: string, @Param('itemID') itemID: string, @Res() response: any) {
    this.logger.info('Retrieving Transaction Data for Item');
    const sqlQuery: ISqlQuery = {
      text: `SELECT price, description, title, "walletAddress"
            FROM items INNER JOIN app_users ON "ownerID" = "userID" WHERE "itemID" = $1;`,
      values: [itemID]
    };

    try {
      const queryResult = await new DataService().executeQueryAsPromise(sqlQuery);
      if (!queryResult.success) {
        return new ResponseHandler().handle(response, queryResult);
      }

      const transactionBuilder = new TransactionBuilder();
      transactionBuilder.description = queryResult.data[0].description;
      transactionBuilder.name = queryResult.data[0].title;
      transactionBuilder.to = queryResult.data[0].walletAddress;
      transactionBuilder.value = queryResult.data[0].price;

      transactionBuilder.callbackUrl =
        `${Globals.GET_BACKEND_HOST()}${Globals.GET_API_PREFIX()}transaction/txStatus/session/${sessionID}`;

      const transaction: Transaction = transactionBuilder.build();

      return new ResponseHandler().handle(response, transaction.toJSON(), false);
    } catch (err) {
      return new ResponseHandler().handle(response, err);
    }
  }

  @Get('/txStatus/session/:sessionID')
  public async getTxStatusForSessionID(@Param('sessionID') sessionID: string,
    @QueryParam('tx') txHash: string,
    @QueryParam('status') status: number,
    @QueryParam('fromApp') fromPumaWallet: number,
    @Res() response: any) {
    this.logger.info('Retrieving Transaction Status for session');
    const sqlQuery: ISqlQuery = {
      text: 'UPDATE sessions SET ("txHash", "status", "fromPumaWallet") = ($1, $2, $3) WHERE "sessionID" =$4 RETURNING *',
      values: [txHash, status, fromPumaWallet, sessionID]
    };

    try {
      const queryResult = await new DataService().executeQueryAsPromise(sqlQuery);
      this.webSocket.emit(`txStatus/${sessionID}`, queryResult);
      return new ResponseHandler().handle(response, queryResult);
    } catch (err) {
      return new ResponseHandler().handle(response, err);
    }
  }

  @Get('/txStatus/txhash/:transactionHash')
  public async retrieveTransactionStatus(@Param('transactionHash') transactionHash: string, @Res() response: any) {
    this.logger.info('Retrieving Transaction Status');
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider(`${Globals.GET_INFURA_URL()}${Globals.GET_INFURA_KEY}`));
      const receipt = await web3.eth.getTransactionReceipt(transactionHash);
      if (!receipt) {
        this.logger.info('Transaction not completed. Trying again after 10 seconds...');
        setTimeout(() => {
          this.retrieveTransactionStatus(transactionHash, response);
        }, 10000);

        return;
      }

      const responseMessage: IResponseMessage = {
        status: 'OK',
        message: 'message',
        success: true,
        data: [receipt]
      };

      return new ResponseHandler().handle(response, responseMessage);
    } catch (err) {
      const errorResponse: IResponseMessage = {
        success: false,
        status: 'FAILED',
        message: `Blockchain request failed. Reason: ${err.message}`
      };

      return new ResponseHandler().handle(response, errorResponse);
    }
  }
}
export interface ITransactionRequest {
  description: string;
  name: string;
  to: string;
  value: number;
}

export interface ITxStatusUpdateRequest {
  txHash: string;
  status: TxStatus;
}