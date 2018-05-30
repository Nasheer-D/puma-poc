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
process.env.BACKEND_HOST = 'http://192.168.178.38:8080/';

const server = supertest.agent('http://localhost:8080/');
const endpoint = 'api/v1/transaction/item';
const networkid = 3; //3 – ropsten, 1- mainnet
const testItem: Item = require('../../../../resources/testData.json').testItem;
const status = 0;

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

describe('An ItemsTransactionController', () => {
    describe('with correct data', () => {
        beforeEach(async () => {
            await insertTestData();
        });
        afterEach(async () => {
            await deleteTestData();
        });

        describe('should handle tx data for item', async () => {
            beforeEach(async () => {
                await initiateSession();
            });
            afterEach(async () => {
                await deleteSession();
            });

            const expectedResponse = {
                success: true,
                status: 'OK',
                message: 'Retrieved transaction data succesfully',
                data: [{
                    description: testItem.description,
                    name: testItem.title,
                    networkid: networkid,
                    to: '',
                    value: testItem.price
                }]
            }

            it('should return the tx data for item', (done) => {
                server.get(`${endpoint}/tx/${sessionID}/${testItem.itemID}`)
                    .expect(200)
                    .end((err: Error, res: any) => {
                        const body = res.body;
                        expect(body).to.have.property('success').that.is.equal(expectedResponse.success);
                        expect(body).to.have.property('status').that.is.equal(expectedResponse.status);
                        expect(body).to.have.property('message').that.is.equal(expectedResponse.message);
                        expect(body).to.have.property('data').to.be.an('array');
                        expect(body.data[0]).to.have.property('description').that.is.equal(testItem.description);
                        expect(body.data[0]).to.have.property('name').that.is.equal(testItem.title);
                        expect(body.data[0]).to.have.property('value').that.is.equal(unit.convert(testItem.price, 'eth', 'wei'));
                        expect(body.data[0]).to.have.property('to').that.is.equal('0xb344ec617313d90331285E33cF4168DDb5C91B21');
                        expect(body.data[0]).to.have.property('callback').that.is.equal(`http://192.168.178.38:8080/${endpoint}/txStatus/session/${sessionID}`);
                        expect(body.data[0]).to.have.property('signature');
                        done(err);
                    });
            })

            it('should return the tx data plain for item', (done) => {
                server.get(`${endpoint}/tx/plain/${sessionID}/${testItem.itemID}`)
                    .expect(200)
                    .end((err: Error, res: any) => {
                        const body = res.body;
                        expect(body).to.have.property('description').that.is.equal(testItem.description);
                        expect(body).to.have.property('name').that.is.equal(testItem.title);
                        expect(body).to.have.property('value').that.is.equal(unit.convert(testItem.price, 'eth', 'wei'));
                        expect(body).to.have.property('to').that.is.equal('0xb344ec617313d90331285E33cF4168DDb5C91B21');
                        expect(body).to.have.property('callback').that.is.equal(`http://192.168.178.38:8080/${endpoint}/txStatus/session/${sessionID}`);
                        expect(body).to.have.property('signature');
                        done(err);
                    });
            })
        });

        describe('should handle tx status for item', async () => {
            beforeEach(async () => {
                await initiateSession();
            });
            afterEach(async () => {
                await deleteSession();
            });

            it('should return the tx status for session', (done) => {
                const txHash = '';
                const fromPumaWallet = 1;
                const expectedResponse: IResponseMessage = {
                    success: true,
                    status: 'OK',
                    message: 'SQL Query completed successful.',
                    data: []
                }

                server.get(`${endpoint}/txStatus/session/${sessionID}?tx=${txHash}&status=${status}&fromApp=${fromPumaWallet}`)
                    .expect(200)
                    .end((err: Error, res: any) => {
                        const body = res.body;
                        expect(body).to.have.property('success').that.is.equal(expectedResponse.success);
                        expect(body).to.have.property('status').that.is.equal(expectedResponse.status);
                        expect(body).to.have.property('message').that.is.equal(expectedResponse.message);
                        expect(body).to.have.property('data').to.be.an('array');
                        expect(body.data[0]).to.have.property('sessionID');
                        expect(body.data[0]).to.have.property('txHash').that.is.equal(txHash);
                        expect(body.data[0]).to.have.property('status').that.is.equal(0);
                        expect(body.data[0]).to.have.property('fromPumaWallet').that.is.equal(true);
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
        describe('should return errors of tx data', async () => {
            it('should return error message when itemID doesnt exist in tx data', (done: any) => {
                const expectedResponse: IResponseMessage = {
                    success: false,
                    status: 'NO DATA',
                    message: 'SQL Query returned no data from database.'
                };

                server.get(`${endpoint}/tx/${sessionID}/'wrong_itemID'`)
                    .expect(400)
                    .end((err: Error, res: any) => {
                        const body = res.body;
                        expect(body).to.have.property('success').that.is.equal(expectedResponse.success);
                        expect(body).to.have.property('status').that.is.equal(expectedResponse.status);
                        expect(body).to.have.property('message').that.is.equal(expectedResponse.message);
                        done(err);
                    });
            });

            it('should return error message when itemID doesnt exist in tx plain', (done: any) => {
                const expectedResponse: IResponseMessage = {
                    success: false,
                    status: 'NO DATA',
                    message: 'SQL Query returned no data from database.'
                };

                server.get(`${endpoint}/tx/plain/${sessionID}/'wrong_itemID'`)
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

        describe('should return errors of tx status', async () => {
            it('should return error message when from app value is wrong', (done: any) => {
                const txHash = '';
                const expectedResponse: IResponseMessage = {
                    success: false,
                    status: 'FAILED',
                    message: 'SQL Query failed. Reason: invalid_text_representation',
                    errcode: '22P02'
                };

                server.get(`${endpoint}/txStatus/session/${sessionID}?tx=${txHash}&status=${status}&fromApp='5'`)
                    .expect(500)
                    .end((err: Error, res: any) => {
                        const body = res.body;
                        expect(body).to.have.property('success').that.is.equal(expectedResponse.success);
                        expect(body).to.have.property('status').that.is.equal(expectedResponse.status);
                        expect(body).to.have.property('message').that.is.equal(expectedResponse.message);
                        expect(body).to.have.property('errcode').that.is.equal(expectedResponse.errcode);
                        done(err);
                    });
            });

            it('should return error message when status value is wrong', (done: any) => {
                const txHash = '';
                const expectedResponse: IResponseMessage = {
                    success: false,
                    status: 'FAILED',
                    message: 'SQL Query failed. Reason: invalid_text_representation',
                    errcode: '22P02'
                };

                server.get(`${endpoint}/txStatus/session/${sessionID}?tx=${txHash}&status=wrong_status&fromApp='1'`)
                    .expect(500)
                    .end((err: Error, res: any) => {
                        const body = res.body;
                        expect(body).to.have.property('success').that.is.equal(expectedResponse.success);
                        expect(body).to.have.property('status').that.is.equal(expectedResponse.status);
                        expect(body).to.have.property('message').that.is.equal(expectedResponse.message);
                        expect(body).to.have.property('errcode').that.is.equal(expectedResponse.errcode);
                        done(err);
                    });
            });;

            it('should return error message when query parameters are null', (done: any) => {
                const expectedResponse: IResponseMessage = {
                    success: false,
                    status: 'FAILED',
                    message: 'SQL Query failed. Reason: not_null_violation',
                    errcode: '23502'
                };

                server.get(`${endpoint}/txStatus/session/${sessionID}`)
                    .expect(500)
                    .end((err: Error, res: any) => {
                        const body = res.body;
                        expect(body).to.have.property('success').that.is.equal(expectedResponse.success);
                        expect(body).to.have.property('status').that.is.equal(expectedResponse.status);
                        expect(body).to.have.property('message').that.is.equal(expectedResponse.message);
                        expect(body).to.have.property('errcode').that.is.equal(expectedResponse.errcode);
                        done(err);
                    });
            });
        });
    });
});
