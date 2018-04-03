import * as supertest from 'supertest';
import 'mocha';
import * as chai from 'chai';
import {TestHelpers} from '../testHelpers';

// tslint:disable-next-line:mocha-no-side-effect-code
const should = chai.should();
// tslint:disable-next-line:no-http-string
const server = supertest.agent('http://localhost:8080');
const endpoint = '/api/v1/login';

describe('An AuthController', () => {
  it('should login an admin user', (done) => {
    const loginParams = {
      username: 'admin',
      password: 'admin'
    };

    server
      .post(endpoint)
      .send(loginParams)
      .expect(TestHelpers.OK)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: Error, res) => {
        if (err) {
          return done(err);
        }
        should.exist(res.body.token);
        should.equal(res.body.user.role, 'admin');
        done(err);
      });
  });
});

describe('An AuthController', () => {
  it('should login a normal user', (done) => {
    const loginParams = {
      username: 'user',
      password: 'passw0rd'
    };

    server
      .post(endpoint)
      .send(loginParams)
      .expect(TestHelpers.OK)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err: Error, res) => {
        if (err) {
          return done(err);
        }
        should.exist(res.body.token);
        should.equal(res.body.user.role, 'user');
        done(err);
      });
  });
});

describe('An AuthController', () => {
  it('should give a "WRONG_PASS" error when the user password is wrong', (done) => {
    const loginParams = {
      username: 'user',
      password: 'wrong_pass'
    };

    server
      .post(endpoint)
      .send(loginParams)
      .expect(TestHelpers.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err: Error, res) => {
        if (err) {
          return done(err);
        }
        should.equal(false, res.body.success);
        should.equal(res.body.errcode, 'WRONG_PASS');
        done(err);
      });
  });
});

describe('An AuthController', () => {
  it('should give a "NO_USER" error when the user does not exists', (done) => {
    const loginParams = {
      username: 'no_user',
      password: 'wrong_pass'
    };

    server
      .post(endpoint)
      .send(loginParams)
      .expect(TestHelpers.BAD_REQUEST)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err: Error, res) => {
        if (err) {
          return done(err);
        }
        should.equal(false, res.body.success);
        should.equal(res.body.errcode, 'NO_USER');
        done(err);
      });
  });
});
