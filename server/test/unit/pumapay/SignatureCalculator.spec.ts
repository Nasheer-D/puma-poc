import * as chai from 'chai';
import { SignatureCalculator } from '../../../../server/src/utils/txHelpers/SignatureCalculator';
import * as utils from 'ethereumjs-util';
import * as ethers from 'ethers';

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
  callback: 'asd',
  description: 'asd',
  name: 'asd',
  networkID: '3',
  to: '0xaA5CBc1eB612e9A6FB7DCA72f559c8BC3a63F510',
  value: 12,
  signature: 'asd'
};

describe('SignatureCalculator with correct transaction data', () => {
    const signatureCalculator = new SignatureCalculator(transaction);
    const signature = signatureCalculator.calculate();
    it('should generate a signature with the correct length', () => {
    expect(signature).to.have.lengthOf(132);
  });
});

describe('SignatureCalculator with wrong transaction data', () => {
  it('should not generate a signature when the _to address does not start with 0x.', () => {
    const signatureCalculator = new SignatureCalculator(wrongTransaction);
    const signature = signatureCalculator.calculate();
    const hash = Buffer.from(
      ethers.utils
        .solidityKeccak256(
          ['bytes', 'bytes', 'bytes', 'uint256', 'address', 'uint256'],
          [
            Buffer.from(wrongTransaction.callback, 'utf8'),
            Buffer.from(wrongTransaction.description, 'utf8'),
            Buffer.from(wrongTransaction.name, 'utf8'),
            wrongTransaction.networkID,
            wrongTransaction.to,
            wrongTransaction.value
          ]
        )
        .substr(2),
      'hex'
    );
    const digest = ethers.utils.keccak256(Buffer.concat([new Buffer('\x19Ethereum Signed Message:\n'), new Buffer(String(hash.length)), hash]));
    const r = Buffer.from(signature.slice(2, 66), 'hex');
    console.log('r: ' + r);
    const s = Buffer.from(signature.slice(66, 130), 'hex');
    console.log('s :' + s);
    let header = parseInt('0x' + signature.slice(130, 132), 16);
    console.log('Header1: ' + header);
    if ((header < 27) || (header > 34)){
      console.log('Header2: ' + header);
      header = header;
    }
    if (header >= 31)
    {
      console.log('Header3: ' + header);
      header -= 4;
      console.log('Header4: ' + header);
      header = header - 27;
    }
    console.log('Header5: ' + header);
    const pk = ethers.SigningKey.recover(digest, r, s, header).toLowerCase();
    console.log('This: ' + pk);
  });
});
