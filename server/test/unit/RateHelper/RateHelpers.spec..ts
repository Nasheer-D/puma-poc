import * as chai from 'chai';
import { RateHelpers } from '../../../../server/src/utils/rateHelpers/RateHelper';
const expect = chai.expect;

let rateHelpers = new RateHelpers()
const rate = 0.015; 

describe('A RateHelpers', () => {

    it('should return rate', () => {
        expect(rateHelpers.getPMAtoUSDRate()).equals(rate);
    });
})