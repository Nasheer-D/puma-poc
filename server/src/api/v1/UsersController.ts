import { Get, JsonController, Res, Req, UseBefore } from 'routing-controllers';
import { ISqlQuery, DataService } from '../../datasource/DataService';
import { ResponseHandler } from '../../utils/responseHandler/ResponseHandler';
import { UserAuthenticatorMiddleware } from '../../middleware/UserAuthenticatorMiddleware';
import { JSONWebToken } from '../../utils/authentication/JSONWebToken';

@JsonController('/user')
@UseBefore(UserAuthenticatorMiddleware)
export class UsersController {
  @Get('/credits')
  public async getLoggedInUserCredits(
    @Req() request: any,
    @Res() response: any) {
    const userID = new JSONWebToken(request).decodedToken.userID;
    const sqlQuery: ISqlQuery = {
      text: `SELECT credits FROM app_users where "userID" = $1`,
      values: [userID]
    };
    try {
      const result = await new DataService().executeQueryAsPromise(sqlQuery);
      return new ResponseHandler().handle(response, result);
    } catch (error) {
      return new ResponseHandler().handle(response, error);
    }
  }
}
