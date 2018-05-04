export interface User {
  userID: string;
  username: string;
  salt: string;
  hash: string;
  role: string;
}
