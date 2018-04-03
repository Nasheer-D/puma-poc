import 'mocha';
import 'reflect-metadata';
import * as chai from 'chai';
import {LoggerFactory} from '../src/utils/logger/LoggerFactory';

chai.should();

describe('The Logger factory', () => {
  before((done) => {
    const factory = new LoggerFactory();
    const logger  = factory.get('test');
    logger.info.should.be.a('function');
    logger.toString = () => 'hi from getDbConfiguration';
    done();
  });

  it('reuses an existing logger', (done) => {
    const factory = new LoggerFactory();
    const logger  = factory.get('test');
    logger.info.should.be.a('function');
    logger.toString().should.equal('hi from getDbConfiguration');
    done();
  });
});
