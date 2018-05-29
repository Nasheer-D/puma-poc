import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as supertest from 'supertest';
import { ISqlQuery, DataService } from '../../../../src/datasource/DataService';
import { Item } from '../../../../src/domain/items/models/Item';
import { IResponseMessage } from '../../../../src/utils/responseHandler/ResponseHandler';
import * as unit from 'ethereumjs-units';

chai.use(chaiAsPromised);
const expect = chai.expect;

process.env.PGHOST = 'localhost';
process.env.PGPORT = '5435';
process.env.PGUSER = 'local_user';
process.env.PGPASSWORD = 'local_pass';
process.env.PGDATABASE = 'local_puma_poc';

const server = supertest.agent('http://localhost:8080/');
const endpoint = 'api/v1/transaction';
const testItem: Item = require('../../../../resources/testData.json').testItem;

const dataservice = new DataService();
const insertTestData = async () => {
  const sqlQuery: ISqlQuery = {
    text: `INSERT INTO items("itemID", "ownerID", title, description, 
        price, size, licence, "itemUrl", tags, rating, "uploadedDate")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
        `,
    values: [
      testItem.itemID,
      testItem.ownerID,
      testItem.title,
      testItem.description,
      testItem.price,
      testItem.size,
      testItem.licence,
      testItem.itemUrl,
      testItem.tags,
      testItem.rating,
      testItem.uploadedDate
    ]
  };

  await dataservice.executeQueryAsPromise(sqlQuery);
};
const sessionID = '000001';
const initiateSession = async () => {
  const sqlQuery: ISqlQuery = {
    text: 'INSERT INTO sessions("sessionID", status) VALUES($1, $2);',
    values: [sessionID, -1]
  }

  await dataservice.executeQueryAsPromise(sqlQuery);
};

const deleteTestData = async () => {
  const sqlQuery: ISqlQuery = {
    text: `DELETE FROM items WHERE "itemID" = $1`,
    values: [testItem.itemID]
  };

  await dataservice.executeQueryAsPromise(sqlQuery);
};

const deleteSession = async () => {
  const sqlQuery: ISqlQuery = {
    text: 'DELETE FROM sessions WHERE "sessionID" = $1;',
    values: [sessionID]
  }

  await dataservice.executeQueryAsPromise(sqlQuery);
};

describe('A TransactionController', () => {
  describe('with correct data', () => {
    beforeEach(async () => {
      await insertTestData();
    });
    afterEach(async () => {
      await deleteTestData();
    });

    it('should initiate a session with random ID', (done) => {
      const expectedResponse: IResponseMessage = {
        success: true,
        status: 'OK',
        message: 'SQL Query completed successful.',
        data: []
      }

      server.get(`${endpoint}/init`)
        .expect(200)
        .end((err: Error, res: any) => {
          const body = res.body;
          expect(body).to.have.property('success').that.is.equal(expectedResponse.success);
          expect(body).to.have.property('status').that.is.equal(expectedResponse.status);
          expect(body).to.have.property('message').that.is.equal(expectedResponse.message);
          expect(body).to.have.property('data').to.be.an('array');
          expect(body.data[0]).to.have.property('sessionID');
          expect(body.data[0]).to.have.property('txHash').that.is.equal(null);
          expect(body.data[0]).to.have.property('status').that.is.equal(-1);
          expect(body.data[0]).to.have.property('fromPumaWallet').that.is.equal(null);
          done(err);
        });
    });

    describe('should handle blockchain tx status', async () => {
      beforeEach(async () => {
        await initiateSession();
      });
      afterEach(async () => {
        await deleteSession();
      });

      it('should return the tx status for blockchain tx hash', (done) => {
        const transactionHash = '0x5b5a5641b918b2d22143cc2f2a6b3b21f30e09bbb13fbd414304becb4ba1cdf0';
        const blockHash = '0xecbe047f90729ab8da1926905563deb7185771d447f34c92646886adf32aa340';
        const from = '0xb344ec617313d90331285e33cf4168ddb5c91b21';
        const to = '0xcb9031894b5736e4d32eb18a19ec6857e604b35a';
        const expectedResponse: IResponseMessage = {
          success: true,
          status: 'OK',
          message: 'message',
          data: []
        }

        server.get(`${endpoint}/txStatus/txhash/${transactionHash}`)
          .expect(200)
          .end((err: Error, res: any) => {
            const body = res.body;
            expect(body).to.have.property('success').that.is.equal(expectedResponse.success);
            expect(body).to.have.property('status').that.is.equal(expectedResponse.status);
            expect(body).to.have.property('message').that.is.equal(expectedResponse.message);
            expect(body).to.have.property('data').to.be.an('array');
            expect(body.data[0]).to.have.property('transactionHash').that.is.equal(transactionHash);
            expect(body.data[0]).to.have.property('blockHash').that.is.equal(blockHash);
            expect(body.data[0]).to.have.property('contractAddress').that.is.equal(null);
            expect(body.data[0]).to.have.property('cumulativeGasUsed').that.is.equal(1944033);
            expect(body.data[0]).to.have.property('from').that.is.equal(from);
            expect(body.data[0]).to.have.property('gasUsed').that.is.equal(21000);
            expect(body.data[0]).to.have.property('logs');
            expect(body.data[0]).to.have.property('logsBloom');
            expect(body.data[0]).to.have.property('status').that.is.equal(true);
            expect(body.data[0]).to.have.property('to').that.is.equal(to);
            expect(body.data[0]).to.have.property('transactionIndex').that.is.equal(1);
            done(err);
          });
      });
    });
  });

  describe('with wrong data', () => {
    beforeEach(async () => {
      await initiateSession();
    });
    afterEach(async () => {
      await deleteSession();
    });

    describe('should return errors of blockchain tx status', async () => {
      it('should return error message when tx hash has wrong length', (done: any) => {
        const transactionHash = '0x5b5a5641b918b2d22143cc2f2a6b3b21f30e09bbb13fbd414304becb4ba1cdf01';
        const expectedResponse: IResponseMessage = {
          success: false,
          status: 'FAILED',
          message: 'Blockchain request failed. Reason: Returned error: invalid argument 0: json: cannot unmarshal hex string of odd length into Go value of type common.Hash'
        };

        server.get(`${endpoint}/txStatus/txhash/${transactionHash}`)
          .expect(400)
          .end((err: Error, res: any) => {
            const body = res.body;
            expect(body).to.have.property('success').that.is.equal(expectedResponse.success);
            expect(body).to.have.property('status').that.is.equal(expectedResponse.status);
            expect(body).to.have.property('message').that.is.equal(expectedResponse.message);
            done(err);
          });
      });
    });
  });
});
