import 'mocha';
import 'reflect-metadata';
import * as chai from 'chai';
import {LoggerFactory} from '../src/utils/logger/LoggerFactory';

chai.should();

describe('The Logger factory', () => {
  before(() => {
    const factory = new LoggerFactory();
    const logger  = factory.getInstance('test');
    logger.info.should.be.a('function');
    logger.toString = () => 'hi from getDbConfiguration';
  });

  it('reuses an existing logger', () => {
    const factory = new LoggerFactory();
    const logger  = factory.getInstance('test');
    logger.info.should.be.a('function');
    logger.toString().should.equal('hi from getDbConfiguration');
  });
});
