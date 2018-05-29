import { JsonController, Body, Res, Param, Get, Put, QueryParam } from 'routing-controllers';
import { LoggerInstance } from 'winston';
import { LoggerFactory } from '../../utils/logger';
import { Container } from 'typedi';
import { v1 } from 'uuid';
import { IResponseMessage, ResponseHandler } from '../../utils/responseHandler/ResponseHandler';
import { Session } from '../../domain/sessions/models/Session';
import { Globals } from '../../globals';

const Web3 = require('web3'); // tslint:disable-line

@JsonController('/transaction')
export class TransactionController {
  private logger: LoggerInstance = Container.get(LoggerFactory).getInstance('TransactionController');

  @Get('/init')
  public async initiateTransactionWithSessionID(@Res() response: any) {
    try {
      const sessionStoredResult = await new Session().storeSessionID(v1());
      return new ResponseHandler().handle(response, sessionStoredResult);
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