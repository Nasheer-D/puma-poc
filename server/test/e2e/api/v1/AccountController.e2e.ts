import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as supertest from 'supertest';
import { ISqlQuery, DataService } from '../../../../src/datasource/DataService';
import { AccountDetails } from '../../../../src/domain/accounts/models/Account';
import { IResponseMessage } from '../../../../src/utils/responseHandler/ResponseHandler';

chai.use(chaiAsPromised);
const expect = chai.expect;

process.env.PGHOST = 'localhost';
process.env.PGPORT = '5435';
process.env.PGUSER = 'local_user';
process.env.PGPASSWORD = 'local_pass';
process.env.PGDATABASE = 'local_puma_poc';

const server = supertest.agent('http://localhost:8080/');
const endpoint = 'api/v1/account';

const testAccount: AccountDetails = require('../../../../resources/testData.json').testAccount;

const dataservice = new DataService();
const insertTestData = async () => {
  const sqlQuery: ISqlQuery = {
    text: `INSERT INTO account_details("ownerID", "date", "paymentMethod", "totalTime", 
    "chargePerMinute", "discountPerMinute", "totalCharged", "totalCredited", "transactionID")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
        `,
    values: [testAccount.ownerID, testAccount.date, testAccount.paymentMethod, testAccount.totalTime, testAccount.chargePerMinute, testAccount.discountPerMinute,
    testAccount.totalCharged, testAccount.totalCredited, testAccount.transactionID]
  }

  await dataservice.executeQueryAsPromise(sqlQuery);
}

const deleteTestData = async () => {
  const sqlQuery: ISqlQuery = {
    text: `DELETE FROM account_details WHERE "transactionID" = $1`,
    values: [testAccount.transactionID]
  }

  await dataservice.executeQueryAsPromise(sqlQuery);
}

describe('An AccountController', () => {
  describe('with successful response', () => {
    beforeEach(async () => {
      await insertTestData();
    });

    afterEach(async () => {
      await deleteTestData();
    });

    const loginCredetials = {
      "username": "user01",
      "password": "passw0rd"
    }

    it('should return an array of user account details', (done) => {
      const userID = testAccount.ownerID;
      const expectedQueryMessage: IResponseMessage = {
        success: true,
        status: 'OK',
        message: 'SQL Query completed successful.',
        data: [testAccount]
      };

      server.post(`api/v1/login`)
        .send(loginCredetials)
        .end((err, res) => {
          const token = res.body.token;
          server.get(`${endpoint}/${userID}`)
            .set('x-access-token', token)
            .expect(200)
            .end((err: Error, res: any) => {
              const body = res.body;
              const numberOfItems = body.data.length;
              expect(body).to.have.property('success').that.is.equal(expectedQueryMessage.success);
              expect(body).to.have.property('status').that.is.equal(expectedQueryMessage.status);
              expect(body).to.have.property('message').that.is.equal(expectedQueryMessage.message);
              expect(body).to.have.property('data').to.be.an('array');
              expect(body.data[numberOfItems - 1]).to.have.property('ownerID').that.is.equal(testAccount.ownerID);
              expect(body.data[numberOfItems - 1]).to.have.property('date').that.is.equal(testAccount.date);
              expect(body.data[numberOfItems - 1]).to.have.property('paymentMethod').that.is.equal(testAccount.paymentMethod);
              expect(body.data[numberOfItems - 1]).to.have.property('totalTime').that.is.equal(testAccount.totalTime);
              expect(body.data[numberOfItems - 1]).to.have.property('chargePerMinute').that.is.equal(testAccount.chargePerMinute);
              expect(body.data[numberOfItems - 1]).to.have.property('discountPerMinute').that.is.equal(testAccount.discountPerMinute);
              expect(body.data[numberOfItems - 1]).to.have.property('totalCharged').that.is.equal(testAccount.totalCharged);
              expect(body.data[numberOfItems - 1]).to.have.property('totalCredited').that.is.equal(testAccount.totalCredited);
              expect(body.data[numberOfItems - 1]).to.have.property('transactionID').that.is.equal(testAccount.transactionID);
              done(err);
            });
        });
    });
  });

  describe('with no data response', () => {
    beforeEach(async () => {
      await insertTestData();
    });

    afterEach(async () => {
      await deleteTestData();
    });

    const loginCredetials2 = {
      "username": "user02",
      "password": "passw0rd"
    }

    it('should return a message when user id does not match owner id of account details', (done) => {
      const userID = testAccount.ownerID;
      const expectedQueryMessage: IResponseMessage = {
        success: false,
        status: 'NO DATA',
        message: 'SQL Query returned no data from database.',
      };

      server.post(`api/v1/login`)
        .send(loginCredetials2)
        .end((err, res) => {
          const token = res.body.token;
          server.get(`${endpoint}/${userID}`)
            .set('x-access-token', token)
            .expect(400)
            .end((err: Error, res: any) => {
              const body = res.body;
              expect(body).to.have.property('success').that.is.equal(expectedQueryMessage.success);
              expect(body).to.have.property('status').that.is.equal(expectedQueryMessage.status);
              expect(body).to.have.property('message').that.is.equal(expectedQueryMessage.message);
              done(err);
            });
        });
    });
  });
});