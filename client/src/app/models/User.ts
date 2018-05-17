export interface User {
  userID: string;
  userName: string;
  emails: string;
  salt: string;
  hash: string;
  credits: number;
  registrationDate: number;
}
