import { IQueryMessage } from '../../datasource/DataService';

export class ResponseHandler {
    public handle(response: any, result: IQueryMessage): any {
        if (result.catched) {
            delete result.catched;
            return response.status(500).send(result);
        } else if (!result.success) {
            return response.status(400).send(result);
        } else {
            return response.status(200).send(result);
        }
    }
}