import * as Web3 from 'web3';
import { JsonController, Post, Body, Res, Param, Get } from 'routing-controllers';
import { LoggerInstance } from 'winston';
import { LoggerFactory } from '../../utils/logger';
import { Container } from 'typedi';

import { IResponseMessage, ResponseHandler } from '../../utils/responseHandler/ResponseHandler';
import { TransactionBuilder, Transaction } from '../../domain/transactions/models/Transaction';
import { ISqlQuery, DataService } from '../../datasource/DataService';

@JsonController('/transaction')
export class TransactionController {
    private logger: LoggerInstance = Container.get(LoggerFactory).getInstance('TransactionController');

    @Get('/wallet/txdetails/:itemID')
    public async retrieveTransactionData(@Param('itemID') itemID: string, @Res() response: any) {
        this.logger.info('Retrieving Transaction Data for Item');
        const sqlQuery: ISqlQuery = {
            text: `SELECT price, description, title, "walletAddress"
            FROM items INNER JOIN app_users ON "ownerID" = "userID" WHERE "itemID" = $1;`,
            values: [itemID]
        };
        const queryResult = await new DataService().executeQueryAsPromise(sqlQuery);
        this.logger.info(queryResult.data[0]);
        if (!queryResult.success) {
            return new ResponseHandler().handle(response, queryResult);
        }

        const transactionBuilder = new TransactionBuilder();
        transactionBuilder.description = queryResult.data[0].description;
        transactionBuilder.name = queryResult.data[0].title;
        transactionBuilder.to = queryResult.data[0].walletAddress;
        transactionBuilder.value = queryResult.data[0].price;

        const transaction: Transaction = transactionBuilder.build();
        const responseMessage: IResponseMessage = {
            success: true,
            status: 'OK',
            message: 'Retrieved transaction data succesfully',
            data: [transaction.toJSON()]
        };

        return new ResponseHandler().handle(response, responseMessage);
    }

    @Get('/txhash/:transactionHash')
    public async retrieveTransactionStatus(@Param('transactionHash') transactionHash: string, @Res() response: any) {
        this.logger.info('Retrieving Transaction Status');
        // tslint:disable-next-line:no-http-string
        const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/ZDNEJN22wNXziclTLijw'));
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
    }
}

export interface ITransactionRequest {
    description: string;
    name: string;
    to: string;
    value: number;
}
