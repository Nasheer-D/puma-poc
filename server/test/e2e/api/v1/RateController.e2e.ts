import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as supertest from 'supertest';

chai.use(chaiAsPromised);
const expect = chai.expect;

process.env.PGHOST = 'localhost';
process.env.PGPORT = '5435';
process.env.PGUSER = 'local_user';
process.env.PGPASSWORD = 'local_pass';
process.env.PGDATABASE = 'local_puma_poc';

const server = supertest.agent('http://localhost:8080/');
const endpoint = 'api/v1/rate';
const rate = 0.015;

describe('A RateController', () => {

    const expectedResponse = {
        success: true,
        status: 'OK',
        message: 'PMA Rate returned succesfully',
        data: [{
            rate: rate
        }]
    }

    it('should return the rate', (done) => {
        server.get(`${endpoint}`)
            .expect(200)
            .end((err: Error, res: any) => {
                const body = res.body;
                expect(body).to.have.property('success').that.is.equal(expectedResponse.success);
                expect(body).to.have.property('status').that.is.equal(expectedResponse.status);
                expect(body).to.have.property('message').that.is.equal(expectedResponse.message);
                expect(body).to.have.property('data').to.be.an('array');
                expect(body.data[0]).to.have.property('rate').that.is.equal(rate);
                done(err);
            });
    })
});