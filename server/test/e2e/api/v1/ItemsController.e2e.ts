import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as supertest from 'supertest';
import { ISqlQuery, DataService } from '../../../../src/datasource/DataService';
import { Item } from '../../../../src/domain/items/models/Item';
import { IResponseMessage } from '../../../../src/utils/responseHandler/ResponseHandler';

chai.use(chaiAsPromised);
const expect = chai.expect;

process.env.PGHOST = 'localhost';
process.env.PGPORT = '5435';
process.env.PGUSER = 'local_user';
process.env.PGPASSWORD = 'local_pass';
process.env.PGDATABASE = 'local_puma_poc';

const server = supertest.agent('http://localhost:8080/');
const endpoint = 'api/v1/items/';

const testItem: Item = require('../../../../resources/testData.json').testItem;

const dataservice = new DataService();
const insertTestData = async () => {
    const sqlQuery: ISqlQuery = {
        text: `INSERT INTO items("itemID", "ownerID", title, description, 
        price, size, licence, "itemUrl", tags, rating, "uploadedDate")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
        `,
        values: [testItem.itemID, testItem.ownerID, testItem.title, testItem.description, testItem.price, testItem.size,
        testItem.licence, testItem.itemUrl, testItem.tags, testItem.rating, testItem.uploadedDate]
    }

    await dataservice.executeQueryAsPromise(sqlQuery);
}

const deleteTestData = async () => {
    const sqlQuery: ISqlQuery = {
        text: `DELETE FROM items WHERE "itemID" = $1`,
        values: [testItem.itemID]
    }

    await dataservice.executeQueryAsPromise(sqlQuery);
}

describe('An ItemsController', () => {
    describe('with successful response', () => {
        beforeEach(async () => {
            await insertTestData();
        });

        afterEach(async () => {
            await deleteTestData();
        });

        it('should return an array of items', (done) => {
            const expectedQueryMessage: IResponseMessage = {
                success: true,
                status: 'OK',
                message: 'SQL Query completed successful.',
                data: [testItem]
            };

            server
                .get(endpoint)
                .expect(200)
                .end((err: Error, res: any) => {
                    const body = res.body;
                    const numberOfItems = body.data.length;
                    expect(body).to.have.property('success').that.is.equal(expectedQueryMessage.success);
                    expect(body).to.have.property('status').that.is.equal(expectedQueryMessage.status);
                    expect(body).to.have.property('message').that.is.equal(expectedQueryMessage.message);
                    expect(body).to.have.property('data').to.be.an('array');
                    expect(body.data[numberOfItems - 1]).to.have.property('itemID').that.is.equal(testItem.itemID);
                    expect(body.data[numberOfItems - 1]).to.have.property('ownerID').that.is.equal(testItem.ownerID);
                    expect(body.data[numberOfItems - 1]).to.have.property('title').that.is.equal(testItem.title);
                    expect(body.data[numberOfItems - 1]).to.have.property('description').that.is.equal(testItem.description);
                    expect(body.data[numberOfItems - 1]).to.have.property('price').that.is.equal(testItem.price);
                    expect(body.data[numberOfItems - 1]).to.have.property('size').that.is.equal(testItem.size);
                    expect(body.data[numberOfItems - 1]).to.have.property('licence').that.is.equal(testItem.licence);
                    expect(body.data[numberOfItems - 1]).to.have.property('itemUrl').that.is.equal(testItem.itemUrl);
                    expect(body.data[numberOfItems - 1]).to.have.property('uploadedDate').that.is.equal(String(testItem.uploadedDate));
                    expect(body.data[numberOfItems - 1]).to.have.property('tags').to.be.an('array');
                    expect(body.data[numberOfItems - 1]).to.have.property('rating').to.be.an('array');
                    done(err);
                });
        });

        it('should get an item by ID', (done) => {
            const expectedQueryMessage: IResponseMessage = {
                success: true,
                status: 'OK',
                message: 'SQL Query completed successful.',
                data: [testItem]
            };

            server
                .get(`${endpoint}${testItem.itemID}`)
                .end((err: Error, res: any) => {
                    const body = res.body;
                    expect(res).to.have.property('status').that.is.equal(200);
                    expect(body).to.have.property('success').that.is.equal(expectedQueryMessage.success);
                    expect(body).to.have.property('status').that.is.equal(expectedQueryMessage.status);
                    expect(body).to.have.property('message').that.is.equal(expectedQueryMessage.message);
                    expect(body).to.have.property('data').to.be.an('array');
                    expect(body.data[0]).to.have.property('itemID').that.is.equal(testItem.itemID);
                    expect(body.data[0]).to.have.property('ownerID').that.is.equal(testItem.ownerID);
                    expect(body.data[0]).to.have.property('title').that.is.equal(testItem.title);
                    expect(body.data[0]).to.have.property('description').that.is.equal(testItem.description);
                    expect(body.data[0]).to.have.property('price').that.is.equal(testItem.price);
                    expect(body.data[0]).to.have.property('size').that.is.equal(testItem.size);
                    expect(body.data[0]).to.have.property('licence').that.is.equal(testItem.licence);
                    expect(body.data[0]).to.have.property('itemUrl').that.is.equal(testItem.itemUrl);
                    expect(body.data[0]).to.have.property('uploadedDate').that.is.equal(String(testItem.uploadedDate));
                    expect(body.data[0]).to.have.property('tags').to.be.an('array');
                    expect(body.data[0]).to.have.property('rating').to.be.an('array');
                    done(err);
                });
        });
    });

    describe('with no data response', () => {
        it('should return a message when the item with ID does not exist', (done: any) => {
            const expectedQueryMessage: IResponseMessage = {
                success: false,
                status: 'NO DATA',
                message: 'SQL Query returned no data from database.'
            };

            server
                .get(endpoint + 'item_id_not_exist')
                .end((err: Error, res: any) => {
                    const body = res.body;
                    expect(res).to.have.property('status').that.is.equal(400);
                    expect(body).to.have.property('success').that.is.equal(expectedQueryMessage.success);
                    expect(body).to.have.property('status').that.is.equal(expectedQueryMessage.status);
                    expect(body).to.have.property('message').that.is.equal(expectedQueryMessage.message);
                    done(err);
                });
        });
    });
})