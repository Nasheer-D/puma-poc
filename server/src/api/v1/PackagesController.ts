import { JsonController, Res, Get, Param } from 'routing-controllers';
import { ISqlQuery, DataService } from '../../datasource/DataService';
import { ResponseHandler } from '../../utils/responseHandler/ResponseHandler';
import { RateHelpers } from '../../utils/rateHelpers/RateHelper';

@JsonController('/packages')
export class PackagesController {
    @Get('/')
    public async getAllPackages(@Res() response: any): Promise<any> {
        const sqlQuery: ISqlQuery = {
            text: 'SELECT * FROM credit_packages;'
        };

        try {
            const result = await new DataService().executeQueryAsPromise(sqlQuery);
            Object.keys(result.data).forEach(key => {
                result.data[key].priceInPMA = result.data[key].priceInUSD / new RateHelpers().getPMAtoUSDRate();
            });
            return new ResponseHandler().handle(response, result);
        } catch (error) {
            return new ResponseHandler().handle(response, error);
        }
    }

    @Get('/:packageID')
    public async getPackageByID(@Param('packageID') packageID: string, @Res() response: any): Promise<any> {
        const sqlQuery: ISqlQuery = {
            text: `SELECT * FROM credit_packages WHERE "packageID" = $1`,
            values: [packageID]
        };
        try {
            const result = await new DataService().executeQueryAsPromise(sqlQuery);
            return new ResponseHandler().handle(response, result);
        } catch (error) {
            return new ResponseHandler().handle(response, error);
        }
    }
}