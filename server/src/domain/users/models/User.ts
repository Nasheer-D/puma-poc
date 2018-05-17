// tslint:disable:variable-name
import * as crypto from 'crypto';
import { Password } from '../../../utils/authentication/Password';
import * as shortid from 'shortid';

export class User {
  private _userID: string;
  private _salt: string;
  private _hash: string;

  public constructor(private _username: string, password: string) {
    this._userID = shortid.generate();
    this._salt = crypto.randomBytes(16).toString('hex');
    this._hash = new Password(password, this.salt).toHash();
  }

  public get salt(): string {
    return this._salt;
  }

  public get hash(): string {
    return this._hash;
  }

  public get userID(): string {
    return this._userID;
  }

  public get username(): string {
    return this._username;
  }

  public get role(): string {
    return this._role;
  }

  public toJSON(): any {
    return {
      userID: this.userID,
      salt: this.salt,
      hash: this.hash,
      username: this.username,
      role: this.role
    };
  }
}

export interface IUserTestData {
  userID: string;
  password: string;
  role: string;
}
