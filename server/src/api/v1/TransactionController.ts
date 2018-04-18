import * as Web3 from 'web3';
import { JsonController, Post, Body, Res, Param, Get } from 'routing-controllers';
import { LoggerInstance } from 'winston';
import { LoggerFactory } from '../../utils/logger';
import { Container } from 'typedi';

import { IResponseMessage, ResponseHandler } from '../../utils/responseHandler/ResponseHandler';
import { TransactionBuilder, Transaction } from '../../domain/transactions/models/Transaction';

@JsonController('/transaction')
export class TransactionController {
    private logger: LoggerInstance = Container.get(LoggerFactory).getInstance('TransactionController');

    @Post('/')
    public retrieveTransactionData(@Body() transactionRequest: ITransactionRequest, @Res() response: any) {
        this.logger.info('Retrieving Transaction Data');

        const transactionBuilder = new TransactionBuilder();
        transactionBuilder.description = transactionRequest.description;
        transactionBuilder.name = transactionRequest.name;
        transactionBuilder.to = transactionRequest.to;
        transactionBuilder.value = transactionRequest.value;

        const transaction: Transaction = transactionBuilder.build();
        const responseMessage: IResponseMessage = {
            success: true,
            status: 'OK',
            message: 'Retrieved transaction data succesfully',
            data: [transaction]
        };

        return new ResponseHandler().handle(response, responseMessage);
    }

    @Get('/:transactionHash')
    public async retrieveTransactionStatus(@Param('transactionHash') transactionHash: string, @Res() response: any) {
        this.logger.info('Retrieving Transaction Status');
        // tslint:disable-next-line:no-http-string
        const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/ZDNEJN22wNXziclTLijw'));
        const receipt = await web3.eth.getTransactionReceipt(transactionHash);
        if (!receipt.status) {
            this.logger.info('Transaction not completed. Trying again...');
            this.retrieveTransactionStatus(transactionHash, response);
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