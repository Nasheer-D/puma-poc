import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { DataService, ISqlQuery } from '../../../src/datasource/DataService';
import { IResponseMessage } from '../../../src/utils/responseHandler/ResponseHandler';

chai.use(chaiAsPromised);
const expect = chai.expect;

process.env.PGHOST = 'localhost';
process.env.PGPORT = '5435';
process.env.PGUSER = 'local_user';
process.env.PGPASSWORD = 'local_pass';
process.env.PGDATABASE = 'local_puma_poc';

const dataservice = new DataService();

const insertTestData = async () => {
    const sqlQuery: ISqlQuery = {
        text: `INSERT INTO test_table("testID") VALUES ($1);`,
        values: ['1234']
    };
    await dataservice.executeQueryAsPromise(sqlQuery);
}

const clearTestData = async () => {
    const sqlQuery: ISqlQuery = {
        text: `DELETE FROM test_table`
    };
    await dataservice.executeQueryAsPromise(sqlQuery);
}

describe('A DataService', () => {
    describe('with a correct query', () => {
        afterEach(async () => {
            await clearTestData();
        });

        beforeEach(async () => {
            await insertTestData();
        });

        it('should return a promise when querying the DB', (done) => {
            const sqlQuery: ISqlQuery = {
                text: `SELECT * FROM test_table`
            };

            const result = dataservice.executeQueryAsPromise(sqlQuery);
            expect(result.then).to.be.a('Function');
            expect(result.catch).to.be.a('Function');
            expect(result).to.eventually.be.fulfilled;
            done();
        });

        it('should return a success message when querying correctly the DB', () => {
            const sqlQuery: ISqlQuery = {
                text: `SELECT * FROM test_table`
            };

            const expectedQueryMessage: IResponseMessage = {
                success: true,
                status: 'OK',
                message: 'SQL Query completed successful.',
                data: [
                    {
                        testID: '1234'
                    }
                ]
            };

            return dataservice.executeQueryAsPromise(sqlQuery).then(res => {
                expect(res).to.have.property('success').that.is.equal(expectedQueryMessage.success);
                expect(res).to.have.property('status').that.is.equal(expectedQueryMessage.status);
                expect(res).to.have.property('message').that.is.equal(expectedQueryMessage.message);
                expect(res).to.have.property('data').to.be.an('array').to.deep.equal(expectedQueryMessage.data);
            });
        });

        it('should return a success message when inserting correctly into the DB', () => {
            const sqlQuery: ISqlQuery = {
                text: `INSERT INTO test_table("testID") VALUES ($1) RETURNING *`,
                values: ['0000']
            };

            const expectedQueryMessage: IResponseMessage = {
                success: true,
                status: 'OK',
                message: 'SQL Query completed successful.',
                data: [
                    {
                        testID: '0000'
                    }
                ]
            };

            return dataservice.executeQueryAsPromise(sqlQuery).then(res => {
                expect(res).to.have.property('success').that.is.equal(expectedQueryMessage.success);
                expect(res).to.have.property('status').that.is.equal(expectedQueryMessage.status);
                expect(res).to.have.property('message').that.is.equal(expectedQueryMessage.message);
                expect(res).to.have.property('data').to.be.an('array').to.deep.equal(expectedQueryMessage.data);
            });
        });
    });

    describe('with a wrong query', () => {
        beforeEach(async () => {
            await clearTestData();
        });

        it('should return a failed query message when there is no data in the DB', () => {
            const sqlQuery: ISqlQuery = {
                text: `SELECT * FROM test_table`
            };

            const expectedQueryMessage: IResponseMessage = {
                success: false,
                status: 'NO DATA',
                message: 'SQL Query returned no data from database.'
            };

            return dataservice.executeQueryAsPromise(sqlQuery).then(res => {
                expect(res).to.have.property('success').that.is.equal(expectedQueryMessage.success);
                expect(res).to.have.property('status').that.is.equal(expectedQueryMessage.status);
                expect(res).to.have.property('message').that.is.equal(expectedQueryMessage.message);
            });
        });

        it('should return a failed query message when querying with syntax error', () => {
            const sqlQuery: ISqlQuery = {
                text: `WRONG QUERY`
            };

            const expectedRejectedMessage: IResponseMessage = {
                success: false,
                status: 'FAILED',
                message: `SQL Query failed. Reason: syntax_error`
            };

            return dataservice.executeQueryAsPromise(sqlQuery).then().catch(err => {
                expect(err).to.have.property('success').that.is.equal(expectedRejectedMessage.success);
                expect(err).to.have.property('status').that.is.equal(expectedRejectedMessage.status);
                expect(err).to.have.property('message').that.is.equal(expectedRejectedMessage.message);
            });
        });

        it('should return a failed query message when querying not existing table', () => {
            const sqlQuery: ISqlQuery = {
                text: `SELECT * FROM no_table`
            };

            const expectedRejectedMessage: IResponseMessage = {
                success: false,
                status: 'FAILED',
                message: `SQL Query failed. Reason: undefined_table`
            };

            return dataservice.executeQueryAsPromise(sqlQuery).then().catch(err => {
                expect(err).to.have.property('success').that.is.equal(expectedRejectedMessage.success);
                expect(err).to.have.property('status').that.is.equal(expectedRejectedMessage.status);
                expect(err).to.have.property('message').that.is.equal(expectedRejectedMessage.message);
            });
        });

        after(async () => {
            await clearTestData();
        });
    })
});