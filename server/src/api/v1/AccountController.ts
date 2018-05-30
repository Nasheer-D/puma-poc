import { Get, JsonController, Res, UseBefore, Param, Req } from 'routing-controllers';
import { DataService, ISqlQuery } from '../../datasource/DataService';
import { ResponseHandler } from '../../utils/responseHandler/ResponseHandler';
import { UserAuthenticatorMiddleware } from '../../middleware/UserAuthenticatorMiddleware';
import { JSONWebToken } from '../../utils/authentication/JSONWebToken';

@JsonController('/account')
export class ItemsController {
  @Get('/:userID')
  @UseBefore(UserAuthenticatorMiddleware)
  public async getAccountDetails(
    @Param('userID') ownerID: string,
    @Req() request: any,
    @Res() response: any) {
    const userID = new JSONWebToken(request).decodedToken.userID;
    const sqlQuery: ISqlQuery = {
      text: `SELECT * FROM account_details  WHERE "ownerID" = $1;`,
      values: [userID]
    };
    try {
      const result = await new DataService().executeQueryAsPromise(sqlQuery);
      if (result.success === true) {
        Object.keys(result.data).forEach(key => {
          result.data[key].date = result.data[key].date * 1000;
          result.data[key].totalTime = result.data[key].totalTime / 60;
        });
      }
      return new ResponseHandler().handle(response, result);
    } catch (error) {
      return new ResponseHandler().handle(response, error);
    }
  }
}
