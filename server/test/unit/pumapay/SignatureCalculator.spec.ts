import * as chai from 'chai';
import { SignatureCalculator } from '../../../../server/src/utils/txHelpers/SignatureCalculator';
import { SignatureDecoder } from '../../../src/utils/testHelpers/SignatureDecoder';

const expect = chai.expect;
const transaction: any = {
  callback: 'test_Callback',
  description: 'test_Description',
  name: 'test_Name',
  networkID: 3,
  to: '0xaA5CBc1eB612e9A6FB7DCA72f559c8BC3a63F510',
  value: 12
};

describe('SignatureCalculator with correct transaction data', () => {
    const signatureCalculator = new SignatureCalculator(transaction);
    const decoder = new SignatureDecoder();
    const signature = signatureCalculator.calculate();
    transaction.signature = signature;
    it('should generate a signature with the correct length', () => {
      expect(signature).to.have.lengthOf(132);
    });

    it('should return the correct public key when decrypted', async() => {
      const decryptedTx = decoder.decrypt(transaction);
      expect(decryptedTx).to.equal('0x41bbc81089e26615fa7bf7ff2dcd051dff773e54');
    });
});

describe('SignatureCalulator with wrong transaction data', () => {
  const signatureCalculator = new SignatureCalculator(transaction);
  
  it('should return an error when address has no prefix', () => {
    transaction.to = 'aA5CBc1eB612e9A6FB7DCA72f559c8BC3a63F510';
    const signature = signatureCalculator.calculate();
    expect(signature).to.have.any.keys('arg','code','reason','value','Error: hex string must have 0x prefix (arg="value", value="aA5CBc1eB612e9A6FB7DCA72f559c8BC3a63F510")');
  });
  it('should return an error when callback has the wrong datatype', () => {
    transaction.callback = 2;
    transaction.to = '0xaA5CBc1eB612e9A6FB7DCA72f559c8BC3a63F510';
    const signature = signatureCalculator.calculate();
    console.log('typeError:::', signature);
    expect(signature).to.include.keys('TypeError: "value" argument must not be a number');
  });
  it('should return an error when name has the wrong datatype', () => {
    transaction.name = 2;
    transaction.callback = 'asd';
    transaction.to = '0xaA5CBc1eB612e9A6FB7DCA72f559c8BC3a63F510';
    const signature = signatureCalculator.calculate();
    expect(signature).to.have.any.keys('arg','code','reason','value','TypeError: "value" argument must not be a number');
  });
});
