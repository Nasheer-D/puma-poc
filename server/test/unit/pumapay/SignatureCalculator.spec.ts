import * as chai from 'chai';
import { SignatureCalcuator } from '../../../src/pumapay/SignatureCalculator';

const expect = chai.expect;
const transaction: any = {
    callback: 'asd',
    description: 'asd',
    name: 'asd',
    networkID: '3',
    to: '0xaA5CBc1eB612e9A6FB7DCA72f559c8BC3a63F510',
    value: 12,
    signature: 'asd'
}

const signatureCalculator = new SignatureCalcuator(transaction);
describe('A SignatureCalculator', () => {
    it('should generate a signature', () => {
        signatureCalculator.calculate();
    });
});