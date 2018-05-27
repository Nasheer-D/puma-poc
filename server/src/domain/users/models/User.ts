// tslint:disable:variable-name
import * as crypto from 'crypto';
import { Password } from '../../../utils/authentication/Password';
import * as shortid from 'shortid';

export class User {
  private _userID: string;
  private _username: string;
  private _email: string;
  private _walletAddress: string;
  private _salt: string;
  private _hash: string;
  private _credits: number;
  private _registrationDate: number;

  public constructor(userBuilder: UserBuilder) {
    this._username = userBuilder.username;
    this._email = userBuilder.email;
    this._walletAddress = userBuilder.walletAddress;
    this._credits = 0;
    this._userID = shortid.generate();
    this._salt = crypto.randomBytes(16).toString('hex');
    this._hash = new Password(userBuilder.password, this.salt).toHash();
    this._registrationDate = Math.floor(Date.now() / 1000);
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

  public get email(): string {
    return this._email;
  }

  public get walletAddress(): string {
    return this._walletAddress;
  }

  public get registrationDate(): number {
    return this._registrationDate;
  }

  public get credits(): number {
    return this._credits;
  }

  public toJSON(): any {
    return {
      userID: this.userID,
      salt: this.salt,
      hash: this.hash,
      username: this.username,
      email: this.email,
      walletAddress: this.walletAddress,
      registrationDate: this.registrationDate
    };
  }
}

export class UserBuilder {
  private _username: string;
  private _password: string;
  private _email: string;
  private _walletAddress: string;

  public build(): User {
    return new User(this);
  }

  /**
   * Getter username
   * @return {string}
   */
  public get username(): string {
    return this._username;
  }

  /**
   * Setter username
   * @param {string} value
   */
  public set username(value: string) {
    this._username = value;
  }

  /**
   * Getter password
   * @return {string}
   */
  public get password(): string {
    return this._password;
  }

  /**
   * Setter password
   * @param {string} value
   */
  public set password(value: string) {
    this._password = value;
  }

  /**
   * Getter email
   * @return {string}
   */
  public get email(): string {
    return this._email;
  }

  /**
   * Setter email
   * @param {string} value
   */
  public set email(value: string) {
    this._email = value;
  }

  /**
   * Getter walletAddress
   * @return {string}
   */
  public get walletAddress(): string {
    return this._walletAddress;
  }

  /**
   * Setter walletAddress
   * @param {string} value
   */
  public set walletAddress(value: string) {
    this._walletAddress = value;
  }

}