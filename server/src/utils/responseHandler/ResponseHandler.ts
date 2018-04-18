export class ResponseHandler {
    public handle(response: any, result: IResponseMessage): any {
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
export interface IResponseMessage {
    success: boolean;
    status: string;
    message: string;
    data?: any;
    errcode?: string;
    catched?: boolean;
}