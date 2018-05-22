import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as supertest from 'supertest';
import { ISqlQuery, DataService } from '../../../../src/datasource/DataService';
import { Package } from '../../../../src/domain/packages/models/Package';
import { IResponseMessage } from '../../../../src/utils/responseHandler/ResponseHandler';

chai.use(chaiAsPromised);
const expect = chai.expect;

process.env.PGHOST = 'localhost';
process.env.PGPORT = '5435';
process.env.PGUSER = 'local_user';
process.env.PGPASSWORD = 'local_pass';
process.env.PGDATABASE = 'local_puma_poc';

const server = supertest.agent('http://localhost:8080/');
const endpoint = 'api/v1/packages/';

const testPackage: Package = require('../../../../resources/testData.json').testPackage;

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
}

const deleteTestData = async () => {
    const sqlQuery: ISqlQuery = {
        text: `DELETE FROM credit_packages WHERE "packageID" = $1`,
        values: [testPackage.packageID]
    }

    await dataservice.executeQueryAsPromise(sqlQuery);
}

describe('A PackageController', () => {
    describe('with successful response', () => {
        beforeEach(async () => {
            await insertTestData();
        });

        afterEach(async () => {
            await deleteTestData();
        });

        it('should return an array of packages', (done) => {
            const expectedQueryMessage: IResponseMessage = {
                success: true,
                status: 'OK',
                message: 'SQL Query completed successful.',
                data: [testPackage]
            };

            server
                .get(endpoint)
                .expect(200)
                .end((err: Error, res: any) => {
                    const body = res.body;
                    const numberOfPackages = body.data.length;
                    expect(body).to.have.property('success').that.is.equal(expectedQueryMessage.success);
                    expect(body).to.have.property('status').that.is.equal(expectedQueryMessage.status);
                    expect(body).to.have.property('message').that.is.equal(expectedQueryMessage.message);
                    expect(body).to.have.property('data').to.be.an('array');
                    expect(body.data[numberOfPackages - 1]).to.have.property('packageID').that.is.equal(testPackage.packageID);
                    expect(body.data[numberOfPackages - 1]).to.have.property('description').that.is.equal(testPackage.description);
                    expect(body.data[numberOfPackages - 1]).to.have.property('title').that.is.equal(testPackage.title);
                    expect(body.data[numberOfPackages - 1]).to.have.property('amount').that.is.equal(testPackage.amount);
                    expect(body.data[numberOfPackages - 1]).to.have.property('bonusCredits').that.is.equal(testPackage.bonusCredits);
                    expect(body.data[numberOfPackages - 1]).to.have.property('bonusTickets').that.is.equal(testPackage.bonusTickets);
                    expect(body.data[numberOfPackages - 1]).to.have.property('featured').that.is.equal(testPackage.featured);
                    expect(body.data[numberOfPackages - 1]).to.have.property('priceInUSD').that.is.equal(testPackage.priceInUSD);
                    done(err);
                });
        });
    });
})