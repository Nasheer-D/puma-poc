import { JsonController, Res, Param, Get } from 'routing-controllers';
import { LoggerInstance } from 'winston';
import { LoggerFactory } from '../../utils/logger';
import { Container } from 'typedi';
import { IResponseMessage, ResponseHandler } from '../../utils/responseHandler/ResponseHandler';
import { TransactionBuilder, Transaction } from '../../domain/transactions/models/Transaction';
import { ISqlQuery, DataService } from '../../datasource/DataService';
import { Globals } from '../../globals';

@JsonController('/transaction')
export class TransactionController {
  private logger: LoggerInstance = Container.get(LoggerFactory).getInstance('TransactionController');

  @Get('/tx/:sessionID/item/:itemID')
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

  @Get('/tx/plain/:sessionID/item/:itemID')
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