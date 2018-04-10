import { Get, JsonController, Res } from 'routing-controllers';
import { DataService, ISqlQuery } from '../../datasource/DataService';
import { ResponseHandler } from '../../utils/responseHandler/ResponseHandler';

@JsonController('/items')
export class ItemsController {

  @Get('/')
  public async getAllItems(@Res() response: any): Promise<any> {
    const sqlQuery: ISqlQuery = {
      text: `SELECT * FROM items`
    };

    try {
      const result = await new DataService().executeQueryAsPromise(sqlQuery);
      return new ResponseHandler().handle(response, result);
    } catch (error) {
      return new ResponseHandler().handle(response, error);
    }
  }
}