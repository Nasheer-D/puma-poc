import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as supertest from 'supertest';
import { IQueryMessage, ISqlQuery, DataService } from '../../../../src/datasource/DataService';
import { Item } from '../../../../src/domain/items/models/Item';
import {TestHelpers} from 'server/test/testHelpers';

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

        it('should get items by id', () => {
            const expectedQueryMessage: IQueryMessage = {
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
                    expect(Promise.resolve(body)).to.eventually.have.property('success').that.is.equal(expectedQueryMessage.success);
                    expect(Promise.resolve(body)).to.eventually.have.property('status').that.is.equal(expectedQueryMessage.status);
                    expect(Promise.resolve(body)).to.eventually.have.property('message').that.is.equal(expectedQueryMessage.message);
                    expect(Promise.resolve(body)).to.eventually.have.property('data').to.be.an('array');
                    expect(Promise.resolve(body.data[numberOfItems - 1])).to.eventually.have.property('itemID').that.is.equal(testItem.itemID);
                    expect(Promise.resolve(body.data[numberOfItems - 1])).to.eventually.have.property('ownerID').that.is.equal(testItem.ownerID);
                    expect(Promise.resolve(body.data[numberOfItems - 1])).to.eventually.have.property('title').that.is.equal(testItem.title);
                    expect(Promise.resolve(body.data[numberOfItems - 1])).to.eventually.have.property('description').that.is.equal(testItem.description);
                    expect(Promise.resolve(body.data[numberOfItems - 1])).to.eventually.have.property('price').that.is.equal(testItem.price);
                    expect(Promise.resolve(body.data[numberOfItems - 1])).to.eventually.have.property('size').that.is.equal(testItem.size);
                    expect(Promise.resolve(body.data[numberOfItems - 1])).to.eventually.have.property('licence').that.is.equal(testItem.licence);
                    expect(Promise.resolve(body.data[numberOfItems - 1])).to.eventually.have.property('itemUrl').that.is.equal(testItem.itemUrl);
                    expect(Promise.resolve(body.data[numberOfItems - 1])).to.eventually.have.property('uploadedDate').that.is.equal(String(testItem.uploadedDate));
                    expect(Promise.resolve(body.data[numberOfItems - 1])).to.eventually.have.property('tags').to.be.an('array');
                    expect(Promise.resolve(body.data[numberOfItems - 1])).to.eventually.have.property('rating').to.be.an('array');
                });
        });

        it('should return an array of items', () => {
            const expectedQueryMessage: IQueryMessage = {
                success: true,
                status: 'OK',
                message: 'SQL Query completed successful.',
                data: [testItem]
            };

            server
                .get(`${endpoint}${testItem.itemID}`)
                .expect(200)
                .end((err: Error, res: any) => {
                    const body = res.body;
                    const numberOfItems = body.data.length;
                    expect(Promise.resolve(body)).to.eventually.have.property('success').that.is.equal(expectedQueryMessage.success);
                    expect(Promise.resolve(body)).to.eventually.have.property('status').that.is.equal(expectedQueryMessage.status);
                    expect(Promise.resolve(body)).to.eventually.have.property('message').that.is.equal(expectedQueryMessage.message);
                    expect(Promise.resolve(body)).to.eventually.have.property('data').to.be.an('array');
                    expect(Promise.resolve(body.data[numberOfItems - 1])).to.eventually.have.property('itemID').that.is.equal(testItem.itemID);
                    expect(Promise.resolve(body.data[numberOfItems - 1])).to.eventually.have.property('ownerID').that.is.equal(testItem.ownerID);
                    expect(Promise.resolve(body.data[numberOfItems - 1])).to.eventually.have.property('title').that.is.equal(testItem.title);
                    expect(Promise.resolve(body.data[numberOfItems - 1])).to.eventually.have.property('description').that.is.equal(testItem.description);
                    expect(Promise.resolve(body.data[numberOfItems - 1])).to.eventually.have.property('price').that.is.equal(testItem.price);
                    expect(Promise.resolve(body.data[numberOfItems - 1])).to.eventually.have.property('size').that.is.equal(testItem.size);
                    expect(Promise.resolve(body.data[numberOfItems - 1])).to.eventually.have.property('licence').that.is.equal(testItem.licence);
                    expect(Promise.resolve(body.data[numberOfItems - 1])).to.eventually.have.property('itemUrl').that.is.equal(testItem.itemUrl);
                    expect(Promise.resolve(body.data[numberOfItems - 1])).to.eventually.have.property('uploadedDate').that.is.equal(String(testItem.uploadedDate));
                    expect(Promise.resolve(body.data[numberOfItems - 1])).to.eventually.have.property('tags').to.be.an('array');
                    expect(Promise.resolve(body.data[numberOfItems - 1])).to.eventually.have.property('rating').to.be.an('array');
                });
        });
    })

    describe('with no data response', () => {
        it('should return a message when the item with ID does not exist', (done: any) => {
            const expectedQueryMessage: IQueryMessage = {
                success: false,
                status: 'NO DATA',
                message: 'SQL Query returned no data from database.'
            };
            server
                .get(endpoint + 'item_id_not_exist')
                .expect(404)
                .expect(TestHelpers.NOT_FOUND)
                .end((err: Error, res: any) => {
                    const body = res.body;
                    expect(Promise.resolve(body)).to.eventually.have.property('success').that.is.equal(expectedQueryMessage.success);
                    expect(Promise.resolve(body)).to.eventually.have.property('status').that.is.equal(expectedQueryMessage.status);
                    expect(Promise.resolve(body)).to.eventually.have.property('message').that.is.equal(expectedQueryMessage.message);
                    done();
                });
        });
    });

})