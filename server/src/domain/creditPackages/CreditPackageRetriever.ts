import { CreditPackage } from './models/CreditPackage';
import { ISqlQuery, DataService } from '../../datasource/DataService';
import { IResponseMessage } from '../../utils/responseHandler/ResponseHandler';
import { LoggerInstance } from 'winston';
import { Container } from 'typedi';
import { LoggerFactory } from '../../utils/logger';

export class CreditPackageRetriever {
    private logger: LoggerInstance = Container.get(LoggerFactory).getInstance('CreditPackageRetriever');

    public async retrieveCreditPackage(packageID: string): Promise<CreditPackage> {
        this.logger.info(`Retrieving package with ID: ${packageID}`);
        const sqlQuery: ISqlQuery = {
            text: `SELECT * FROM credit_packages WHERE "packageID" = $1;`,
            values: [packageID]
        };

        const queryResult: IResponseMessage = await new DataService().executeQueryAsPromise(sqlQuery);
        if (!queryResult.success) {
            return null;
        }

        return queryResult.data[0];
    }
}