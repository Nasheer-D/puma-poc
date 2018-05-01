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
        const hash = Buffer.from(ethers.utils.solidityKeccak256(
            ['bytes', 'bytes', 'bytes', 'uint256', 'address', 'uint256'],
            [
                Buffer.from(this.transaction.callback, 'utf8'),
                Buffer.from(this.transaction.description, 'utf8'),
                Buffer.from(this.transaction.name, 'utf8'),
                this.transaction.networkID,
                this.transaction.to,
                this.transaction.value
            ]).substr(2), 'hex');

        const prefix = new Buffer('\x19Ethereum Signed Message:\n');
        const prefixedMsg = Buffer.from(
            ethers.utils.keccak256(Buffer.concat(
                [prefix, new Buffer(String(hash.length)), hash]
            )).substr(2), 'hex');
        // TODO: store secret key
        const privateKey = Buffer.from('7737d0e22f791970f8a847d24f27d90d4693d39074b76a758a99232aba6ec37a', 'hex');
        const sig = utils.ecsign(prefixedMsg, privateKey);

        return utils.toRpcSig(sig.v, sig.r, sig.s);
    }
}