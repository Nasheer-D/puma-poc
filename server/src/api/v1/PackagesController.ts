import { JsonController, Res, Get, Param } from 'routing-controllers';
import { ISqlQuery, DataService } from '../../datasource/DataService';
import { ResponseHandler } from '../../utils/responseHandler/ResponseHandler';

@JsonController('/packages')
export class PackagesController {
    @Get('/')
    public async getAllPackages(@Res() response: any): Promise<any> {
        const sqlQuery: ISqlQuery = {
            text: 'SELECT * FROM credit_packages;'
        };

        try {
            const result = await new DataService().executeQueryAsPromise(sqlQuery);
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