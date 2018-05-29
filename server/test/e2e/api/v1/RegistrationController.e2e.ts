import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as supertest from 'supertest';
import { IResponseMessage } from '../../../../src/utils/responseHandler/ResponseHandler';

chai.use(chaiAsPromised);
const expect = chai.expect;

process.env.PGHOST = 'localhost';
process.env.PGPORT = '5435';
process.env.PGUSER = 'local_user';
process.env.PGPASSWORD = 'local_pass';
process.env.PGDATABASE = 'local_puma_poc';

const server = supertest.agent('http://localhost:8080/');
const endpoint = 'api/v1/register/';

describe('A RegistrationController', () => {
  const registrationDetails = {
    username: 'testusername',
    email: 'testemail',
    password: "passw0rd"
  }

  it('should insert a new user', (done) => {
    const expectedQueryMessage: IResponseMessage = {
      success: true,
      status: 'OK',
      message: 'SQL Query completed successful.',
      data: []
    };

    server.post(`${endpoint}`)
      .send(registrationDetails)
      .expect(200)
      .end((err: Error, res: any) => {
        const body = res.body;
        const numberOfPackages = body.data.length;
        expect(body).to.have.property('success').that.is.equal(expectedQueryMessage.success);
        expect(body).to.have.property('status').that.is.equal(expectedQueryMessage.status);
        expect(body).to.have.property('message').that.is.equal(expectedQueryMessage.message);
        expect(body).to.have.property('data').to.be.an('array');
        expect(body.data[numberOfPackages - 1]).to.have.property('userName').that.is.equal(registrationDetails.username);
        expect(body.data[numberOfPackages - 1]).to.have.property('email').that.is.equal(registrationDetails.email);
        expect(body.data[numberOfPackages - 1]).to.have.property('salt').that.is.not.null;
        expect(body.data[numberOfPackages - 1]).to.have.property('hash').that.is.not.null;
        done(err);
      });
  });
});
