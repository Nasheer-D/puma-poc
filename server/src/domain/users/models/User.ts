// tslint:disable:variable-name

import * as shortid from 'shortid';

export class User {
  private _userID: string;
  private _username: string;
  private _salt: string;
  private _hash: string;

  public get userID(): string {
    return this._userID;
  }

  public get username(): string {
    return this._username;
  }

  public get salt(): string {
    return this._salt;
  }

  public get hash(): string {
    return this._hash;
  }

  public toJSON(): any {
    return {
      thingID: this.userID,
      description: this.username
    };
  }
}