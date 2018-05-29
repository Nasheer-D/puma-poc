import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as supertest from 'supertest';
import { ISqlQuery, DataService } from '../../../../src/datasource/DataService';
import { IResponseMessage } from '../../../../src/utils/responseHandler/ResponseHandler';
import * as unit from 'ethereumjs-units';
import { CreditPackage } from '../../../../src/domain/creditPackages/models/CreditPackage';
import { RateHelpers } from '../../../../src/utils/rateHelpers/RateHelper';

chai.use(chaiAsPromised);
const expect = chai.expect;

process.env.PGHOST = 'localhost';
process.env.PGPORT = '5435';
process.env.PGUSER = 'local_user';
process.env.PGPASSWORD = 'local_pass';
process.env.PGDATABASE = 'local_puma_poc';
process.env.BACKEND_HOST = 'http://192.168.1.54:8080/';

const server = supertest.agent('http://localhost:8080/');
const endpoint = 'api/v1/transaction/package';
const networkid = 3; //3 – ropsten, 1- mainnet
const testPackage: CreditPackage = require('../../../../resources/testData.json').testPackage;
const status = 0;

const dataservice = new DataService();
const insertTestData = async () => {
    const sqlQuery: ISqlQuery = {
        text: `INSERT INTO credit_packages("packageID", "ownerID", amount, "bonusCredits", "bonusTickets", 
            featured, "priceInUSD", description, title)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
        `,
        values: [
            testPackage.packageID,
            testPackage.ownerID,
            testPackage.amount,
            testPackage.bonusCredits,
            testPackage.bonusTickets,
            testPackage.featured,
            testPackage.priceInUSD,
            testPackage.description,
            testPackage.title
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
        text: `DELETE FROM credit_packages WHERE "packageID" = $1`,
        values: [testPackage.packageID]
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

const loginCredetials = {
    "username": "user01",
    "password": "passw0rd"
}

describe('A PackageTransactionController', () => {
    describe('with correct data', () => {
        beforeEach(async () => {
            await insertTestData();
        });
        afterEach(async () => {
            await deleteTestData();
        });

        describe('should handle tx data for credit package', async () => {
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
                    description: testPackage.description,
                    name: testPackage.title,
                    networkid: networkid,
                    to: '',
                    value: testPackage.priceInUSD * new RateHelpers().getPMAtoUSDRate()
                }]
            }

            it('should return the tx data for credit package', (done) => {
                server.post(`api/v1/login`)
                    .send(loginCredetials)
                    .end((err, res) => {
                        const token = res.body.token;
                        server.get(`${endpoint}/tx/${sessionID}/${testPackage.packageID}`)
                            .set('x-access-token', token)
                            .expect(200)
                            .end((err: Error, res: any) => {
                                const body = res.body;
                                expect(body).to.have.property('success').that.is.equal(expectedResponse.success);
                                expect(body).to.have.property('status').that.is.equal(expectedResponse.status);
                                expect(body).to.have.property('message').that.is.equal(expectedResponse.message);
                                expect(body).to.have.property('data').to.be.an('array');
                                expect(body.data[0]).to.have.property('description').that.is.equal(testPackage.description);
                                expect(body.data[0]).to.have.property('name').that.is.equal(testPackage.title);
                                expect(body.data[0]).to.have.property('value').that.is
                                    .equal(unit.convert(testPackage.priceInUSD * new RateHelpers().getPMAtoUSDRate(), 'eth', 'wei'));
                                expect(body.data[0]).to.have.property('to').that.is.equal('0xb344ec617313d90331285E33cF4168DDb5C91B21');
                                expect(body.data[0]).to.have.property('callback').that.is
                                    .equal(`http://192.168.1.54:8080/${endpoint}/txStatus/${testPackage.packageID}/${loginCredetials.username}/session/${sessionID}`);
                                expect(body.data[0]).to.have.property('signature');
                                done(err);
                            });
                    });
            })

            it('should return the tx data plain for item', (done) => {
                server.post(`api/v1/login`)
                    .send(loginCredetials)
                    .end((err, res) => {
                        const token = res.body.token;
                        server.get(`${endpoint}/tx/plain/${sessionID}/${testPackage.packageID}`)
                            .set('x-access-token', token)
                            .expect(200)
                            .end((err: Error, res: any) => {
                                const body = res.body;
                                expect(body).to.have.property('description').that.is.equal(testPackage.description);
                                expect(body).to.have.property('name').that.is.equal(testPackage.title);
                                expect(body).to.have.property('value').that.is
                                    .equal(unit.convert(testPackage.priceInUSD * new RateHelpers().getPMAtoUSDRate(), 'eth', 'wei'));
                                expect(body).to.have.property('to').that.is.equal('0xb344ec617313d90331285E33cF4168DDb5C91B21');
                                expect(body).to.have.property('callback').that.is
                                    .equal(`http://192.168.1.54:8080/${endpoint}/txStatus/${testPackage.packageID}/${loginCredetials.username}/session/${sessionID}`);
                                expect(body).to.have.property('signature');
                                done(err);
                            });
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

                server
                    .get(`${endpoint}/txStatus/${testPackage.packageID}/${loginCredetials.username}/session/${sessionID}?tx=${txHash}&status=${status}&fromApp=${fromPumaWallet}`)
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

                server.post(`api/v1/login`)
                    .send(loginCredetials)
                    .end((err, res) => {
                        const token = res.body.token;
                        server.get(`${endpoint}/tx/${sessionID}/'wrong_itemID'`)
                            .set('x-access-token', token)
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

            it('should return error message when itemID doesnt exist in tx plain', (done: any) => {
                const expectedResponse: IResponseMessage = {
                    success: false,
                    status: 'NO DATA',
                    message: 'SQL Query returned no data from database.'
                };

                server.post(`api/v1/login`)
                    .send(loginCredetials)
                    .end((err, res) => {
                        const token = res.body.token;
                        server.get(`${endpoint}/tx/${sessionID}/'wrong_itemID'`)
                            .set('x-access-token', token)
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

        describe('should return errors of tx status', async () => {
            it('should return error message when from app value is wrong', (done: any) => {
                const txHash = '';
                const expectedResponse: IResponseMessage = {
                    success: false,
                    status: 'FAILED',
                    message: 'SQL Query failed. Reason: invalid_text_representation',
                    errcode: '22P02'
                };

                server
                    .get(`${endpoint}/txStatus/${testPackage.packageID}/${loginCredetials.username}/session/${sessionID}?tx=${txHash}&status=${status}&fromApp='5'`)
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
                server
                    .get(`${endpoint}/txStatus/${testPackage.packageID}/${loginCredetials.username}/session/${sessionID}?tx=${txHash}&status=wrong_status&fromApp='1'`)
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

                server
                    .get(`${endpoint}/txStatus/${testPackage.packageID}/${loginCredetials.username}/session/${sessionID}`)
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

            it('should return error message when no access token is passed in the header', (done: any) => {
                const expectedResponse: IResponseMessage = {
                    success: false,
                    status: 'FAILED',
                    message: 'No token provided.'
                };

                server.get(`${endpoint}/tx/plain/${sessionID}/${testPackage.packageID}`)
                    .expect(403)
                    .end((err: Error, res: any) => {
                        const body = res.body;
                        expect(body).to.have.property('success').that.is.equal(expectedResponse.success);
                        expect(body).to.have.property('status').that.is.equal(expectedResponse.status);
                        expect(body).to.have.property('message').that.is.equal(expectedResponse.message);
                        done(err);
                    });
            });

            it('should return error message when wrong access token is passed in the header', (done: any) => {
                const expectedResponse: IResponseMessage = {
                    success: false,
                    status: 'FAILED',
                    message: 'Failed to authenticate token.'
                };

                server.get(`${endpoint}/tx/plain/${sessionID}/${testPackage.packageID}`)
                    .set('x-access-token', 'wrong_access_token')
                    .expect(403)
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
