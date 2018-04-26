import { ISqlQuery, DataService } from '../../../datasource/DataService';
import { IResponseMessage } from '../../../utils/responseHandler/ResponseHandler';

export interface Session {
    sessionID: string;
    txHash: string;
    status: TxStatus;
}

export enum TxStatus {
    initiated,
    scanned,
    open,
    approved,
    declined,
    cancelled
}

export class Session {
    public storeSessionID(sessionID: string): Promise<IResponseMessage> {
        const sqlQuery: ISqlQuery = {
            text: `INSERT INTO sessions("sessionID", status) VALUES ($1, $2) RETURNING *;`,
            values: [sessionID, TxStatus.initiated]
        };

        return new DataService().executeQueryAsPromise(sqlQuery);
    }
}