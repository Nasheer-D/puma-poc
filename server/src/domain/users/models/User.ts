// tslint:disable:variable-name
import * as shortid from 'shortid';

export class User {
  public userID: string;
  public username: string;
  public salt: string;
  public hash: string;
}