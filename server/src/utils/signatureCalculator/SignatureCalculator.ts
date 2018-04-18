import * as ethers from 'ethers';
import * as utils from 'ethereumjs-util';
import { LoggerInstance } from 'winston';
import { Container } from 'typedi';
import { LoggerFactory } from '../logger';
import { Transaction } from '../../domain/transactions/models/Transaction';

export class SignatureCalculator {
    private logger: LoggerInstance = Container.get(LoggerFactory).getInstance('SignatureCalcuator');

    public constructor(private transaction: Transaction) {
    }

    public calculate(): string {
        this.logger.info('Calculating Singature');
        const hash = ethers.utils.solidityKeccak256(
            ['bytes', 'bytes', 'bytes', 'uint256', 'address', 'uint256'],
            [
                Buffer.from(this.transaction.callback, 'utf8'),
                Buffer.from(this.transaction.description, 'utf8'),
                Buffer.from(this.transaction.name, 'utf8'),
                this.transaction.networkid,
                this.transaction.to,
                this.transaction.value
            ]);

        const prefix = new Buffer('\x19Ethereum Signed Message:\n');
        const prefixedMsg = Buffer.from(
            ethers.utils.keccak256(Buffer.concat(
                [prefix, new Buffer(String(hash.length)), Buffer.from(hash.substr(2), 'hex')]
            )).substr(2), 'hex');
        // TODO: store secret key
        const privateKey = Buffer.from('98c1f1a2ffa5e704eb499a9852837cc7e30fee258035b60263d05a6ed31af621', 'hex');

        return utils.ecsign(prefixedMsg, privateKey);
    }
}