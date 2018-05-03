import * as chai from 'chai';
import { SignatureCalculator } from '../../../../server/src/utils/txHelpers/SignatureCalculator';
import { IResponseMessage } from '../../../src/utils/responseHandler/ResponseHandler';

const expect = chai.expect;
const transaction: any = {
  callback: 'asd',
  description: 'asd',
  name: 'asd',
  networkID: '3',
  to: '0xaA5CBc1eB612e9A6FB7DCA72f559c8BC3a63F510',
  value: 12,
  signature: 'asd'
};

const wrongTransaction: any = {
  value: 12,
  callback: 'asd',
  description: 'asd',
  name: 'asd',
  networkID: '3',
  to: '0xaA5CBc1eB612e9A6FB7DCA72f559c8BC3a63F510',
  signature: 'asd'
};

describe('SignatureCalculator with correct transaction data', () => {
  it('should generate a signature', () => {
    const signatureCalculator = new SignatureCalculator(transaction);
    const signature = signatureCalculator.calculate();
    expect(signature).to.have.lengthOf(132);
  });
});

describe('SignatureCalculator with wrong transaction data', () => {
  it('should not generate a signature', () => {
    const signatureCalculator = new SignatureCalculator(wrongTransaction);
    const signature = signatureCalculator.calculate();
    console.log('wrong signature ' + signature);
  });
});
