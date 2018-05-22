import { CreditPackageRetriever } from './CreditPackageRetriever';
import { LoggerInstance } from 'winston';
import { Container } from 'typedi';
import { LoggerFactory } from '../../utils/logger';
import { CreditPackage } from './models/CreditPackage';
import { ISqlQuery, DataService } from '../../datasource/DataService';
import { IResponseMessage } from '../../utils/responseHandler/ResponseHandler';

export class CreditAdder {
    private logger: LoggerInstance = Container.get(LoggerFactory).getInstance('CreditAdder');

    public async addCreditsToUser(packageID: string, userID: string): Promise<boolean> {
        this.logger.info(`Adding credits for package with ID: ${packageID} to user with ID: ${userID}`);
        const creditPackage: CreditPackage = await new CreditPackageRetriever().retrieveCreditPackage(packageID);

        if (creditPackage === null) {
            this.logger.info(`Failed to retrieve package with ID: ${packageID}`);
            return false;
        }
        const amountOfCreditsToBeCredited = Number(creditPackage.amount);
        const sqlQuery: ISqlQuery = {
            text: `UPDATE app_users SET credits = credits + $1 WHERE "userID"=$2 RETURNING *;`,
            values: [amountOfCreditsToBeCredited, userID]
        };

        const queryResult: IResponseMessage = await new DataService().executeQueryAsPromise(sqlQuery);
        if (!queryResult.success) {
            this.logger.info(`Failed to add package credits to the user`);
            return false;
        }

        return true;
    }
}