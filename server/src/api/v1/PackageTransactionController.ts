import { JsonController, Res, Param, Get, QueryParam, UseBefore, Req } from 'routing-controllers';
import { LoggerInstance } from 'winston';
import { LoggerFactory } from '../../utils/logger';
import { Container } from 'typedi';
import { IResponseMessage, ResponseHandler } from '../../utils/responseHandler/ResponseHandler';
import { TransactionBuilder, Transaction } from '../../domain/transactions/models/Transaction';
import { ISqlQuery, DataService } from '../../datasource/DataService';
import { Globals } from '../../globals';
import { RateHelpers } from '../../utils/rateHelpers/RateHelper';
import * as io from 'socket.io';
import { TxStatus } from '../../domain/sessions/models/Session';
import { CreditAdder } from '../../domain/creditPackages/CreditAdder';
import { UserAuthenticatorMiddleware } from '../../middleware/UserAuthenticatorMiddleware';
import { JSONWebToken } from '../../utils/authentication/JSONWebToken';

@JsonController('/transaction/package')
export class PackageTransactionController {
  private logger: LoggerInstance = Container.get(LoggerFactory).getInstance('PackageTransactionController');
  private webSocket: io = Container.get(io);

  @Get('/tx/:sessionID/:packageID')
  @UseBefore(UserAuthenticatorMiddleware)
  public async retrieveTransactionData(
    @Param('sessionID') sessionID: string,
    @Param('packageID') packageID: string,
    @Req() request: any, @Res() response: any) {
    this.logger.info('Retrieving Transaction Data for Package');
    const sqlQuery: ISqlQuery = {
      text: `SELECT "priceInUSD", description, title, "walletAddress"
            FROM credit_packages INNER JOIN app_users ON "ownerID" = "userID" WHERE "packageID" = $1;`,
      values: [packageID]
    };

    try {
      const queryResult = await new DataService().executeQueryAsPromise(sqlQuery);
      if (!queryResult.success) {
        return new ResponseHandler().handle(response, queryResult);
      }

      const priceInPMA = queryResult.data[0].priceInUSD * new RateHelpers().getPMAtoUSDRate();
      const transactionBuilder = new TransactionBuilder();
      transactionBuilder.description = queryResult.data[0].description;
      transactionBuilder.name = queryResult.data[0].title;
      transactionBuilder.to = queryResult.data[0].walletAddress;
      transactionBuilder.value = priceInPMA;

      const userID = new JSONWebToken(request).decodedToken.userID;
      transactionBuilder.callbackUrl =
        `${Globals.GET_BACKEND_HOST()}${Globals.GET_API_PREFIX()}transaction/package/txStatus/${packageID}/${userID}/session/${sessionID}`;

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

  @Get('/tx/plain/:sessionID/:packageID')
  @UseBefore(UserAuthenticatorMiddleware)
  public async retrieveTransaction(
    @Param('sessionID') sessionID: string,
    @Param('packageID') packageID: string,
    @Req() request: any,
    @Res() response: any) {
    this.logger.info('Retrieving Transaction Data for Item');
    const sqlQuery: ISqlQuery = {
      text: `SELECT "priceInUSD", description, title, "walletAddress"
            FROM credit_packages INNER JOIN app_users ON "ownerID" = "userID" WHERE "packageID" = $1;`,
      values: [packageID]
    };

    try {
      const queryResult = await new DataService().executeQueryAsPromise(sqlQuery);
      if (!queryResult.success) {
        return new ResponseHandler().handle(response, queryResult);
      }

      const priceInPMA = queryResult.data[0].priceInUSD * new RateHelpers().getPMAtoUSDRate();
      const transactionBuilder = new TransactionBuilder();
      transactionBuilder.description = queryResult.data[0].description;
      transactionBuilder.name = queryResult.data[0].title;
      transactionBuilder.to = queryResult.data[0].walletAddress;
      transactionBuilder.value = priceInPMA;

      const userID = new JSONWebToken(request).decodedToken.userID;
      transactionBuilder.callbackUrl =
        `${Globals.GET_BACKEND_HOST()}${Globals.GET_API_PREFIX()}transaction/package/txStatus/${packageID}/${userID}/session/${sessionID}`;

      const transaction: Transaction = transactionBuilder.build();

      return new ResponseHandler().handle(response, transaction.toJSON(), false);
    } catch (err) {
      return new ResponseHandler().handle(response, err);
    }
  }

  @Get('/txStatus/:packageID/:userID/session/:sessionID')
  public async getTxStatusForSessionID(
    @Param('sessionID') sessionID: string,
    @Param('packageID') packageID: string,
    @Param('userID') userID: string,
    @QueryParam('tx') txHash: string,
    @QueryParam('status') status: number,
    @QueryParam('fromApp') fromPumaWallet: number,
    @Res() response: any) {
    this.logger.info('Retrieving Transaction Status for session');
    const sqlQuery: ISqlQuery = {
      text: 'UPDATE sessions SET ("txHash", "status", "fromPumaWallet") = ($1, $2, $3) WHERE "sessionID" =$4 RETURNING *',
      values: [txHash, status, fromPumaWallet, sessionID]
    };

    if (status === TxStatus.approved) {
      const creditAdded = await new CreditAdder().addCreditsToUser(packageID, userID);
      if (!creditAdded) {
        this.logger.info(JSON.stringify(creditAdded));
        const creditAddedResponse: IResponseMessage = {
          success: false,
          status: 'FAILED',
          message: 'Failed to add credits for user'
        };

        return new ResponseHandler().handle(response, creditAddedResponse);
      }
    }

    try {
      const queryResult = await new DataService().executeQueryAsPromise(sqlQuery);
      this.webSocket.emit(`txStatus/${sessionID}`, queryResult);
      return new ResponseHandler().handle(response, queryResult);
    } catch (err) {
      return new ResponseHandler().handle(response, err);
    }
  }
}