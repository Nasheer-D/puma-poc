export interface User {
  userID: string;
  userName: string;
  email: string;
  salt: string;
  hash: string;
  credits: number;
  registrationDate: number;
}

export interface IRegistrationDetails {
  username: string;
  email: string;
  password: string;
}
