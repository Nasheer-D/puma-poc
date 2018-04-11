import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { DataService, ISqlQuery, IQueryMessage } from '../../../src/datasource/DataService';

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

        it('should return a success message when querying correctly the DB', () => {
            const sqlQuery: ISqlQuery = {
                text: `SELECT * FROM test_table`
            };

            const result = dataservice.executeQueryAsPromise(sqlQuery);

            const expectedQueryMessage: IQueryMessage = {
                success: true,
                status: 'OK',
                message: 'SQL Query completed successful.',
                data: [
                    {
                        testID: '1234'
                    }
                ]
            };

            expect(result.then).to.be.a('Function');
            expect(result.catch).to.be.a('Function');
            expect(result).to.eventually.be.fulfilled;
            expect(Promise.resolve(result)).to.eventually.have.property('success').that.is.equal(expectedQueryMessage.success);
            expect(Promise.resolve(result)).to.eventually.have.property('status').that.is.equal(expectedQueryMessage.status);
            expect(Promise.resolve(result)).to.eventually.have.property('message').that.is.equal(expectedQueryMessage.message);
            expect(Promise.resolve(result)).to.eventually.have.property('data').to.be.an('array').to.deep.equal(expectedQueryMessage.data);
        });

        it('should return a success message when inserting correctly into the DB',  () => {
            const sqlQuery: ISqlQuery = {
                text: `INSERT INTO test_table("testID") VALUES ($1) RETURNING *`,
                values: ['0000']
            };
            const result = dataservice.executeQueryAsPromise(sqlQuery);

            const expectedQueryMessage: IQueryMessage = {
                success: true,
                status: 'OK',
                message: 'SQL Query completed successful.',
                data: [
                    {
                        testID: '0000'
                    }
                ]
            };

            expect(result.then).to.be.a('Function');
            expect(result.catch).to.be.a('Function');
            expect(result).to.eventually.be.fulfilled;
            expect(Promise.resolve(result)).to.eventually.have.property('success').that.is.equal(expectedQueryMessage.success);
            expect(Promise.resolve(result)).to.eventually.have.property('status').that.is.equal(expectedQueryMessage.status);
            expect(Promise.resolve(result)).to.eventually.have.property('message').that.is.equal(expectedQueryMessage.message);
            expect(Promise.resolve(result)).to.eventually.have.property('data').to.be.an('array').to.deep.equal(expectedQueryMessage.data);
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
            const result = dataservice.executeQueryAsPromise(sqlQuery);

            const expectedQueryMessage: IQueryMessage = {
                success: false,
                status: 'NO DATA',
                message: 'SQL Query returned no data from database.'
            };

            expect(result.then).to.be.a('Function');
            expect(result.catch).to.be.a('Function');
            expect(result).to.eventually.be.fulfilled;
            expect(Promise.resolve(result)).to.eventually.have.property('success').that.is.equal(expectedQueryMessage.success);
            expect(Promise.resolve(result)).to.eventually.have.property('status').that.is.equal(expectedQueryMessage.status);
            expect(Promise.resolve(result)).to.eventually.have.property('message').that.is.equal(expectedQueryMessage.message);
        });

        it('should return a failed query message when querying with syntax error', () => {
            const sqlQuery: ISqlQuery = {
                text: `WRONG QUERY`
            };

            const result = dataservice.executeQueryAsPromise(sqlQuery);

            const expectedRejectedMessage: IQueryMessage = {
                success: false,
                status: 'FAILED',
                message: `SQL Query failed. Reason: syntax_error`
            };

            expect(result.then).to.be.a('Function');
            expect(result.catch).to.be.a('Function');
            expect(result).to.eventually.be.rejected.and.have.property('success').that.is.equal(expectedRejectedMessage.success);
            expect(result).to.eventually.be.rejected.and.have.property('status').that.is.equal(expectedRejectedMessage.status);
            expect(result).to.eventually.be.rejected.and.have.property('message').that.is.equal(expectedRejectedMessage.message);
        });

        it('should return a failed query message when querying not existing table', () => {
            const sqlQuery: ISqlQuery = {
                text: `SELECT * FROM no_table`
            };

            const result = dataservice.executeQueryAsPromise(sqlQuery);

            const expectedRejectedMessage: IQueryMessage = {
                success: false,
                status: 'FAILED',
                message: `SQL Query failed. Reason: undefined_table`
            };

            expect(result.then).to.be.a('Function');
            expect(result.catch).to.be.a('Function');
            expect(result).to.eventually.be.rejected.and.have.property('success').that.is.equal(expectedRejectedMessage.success);
            expect(result).to.eventually.be.rejected.and.have.property('status').that.is.equal(expectedRejectedMessage.status);
            expect(result).to.eventually.be.rejected.and.have.property('message').that.is.equal(expectedRejectedMessage.message);
        });

        after(async () => {
            await clearTestData();
        });
    })
});