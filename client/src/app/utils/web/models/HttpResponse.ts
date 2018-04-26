import { User } from '../../../models/User';

export class HttpResponse {
  success: boolean;
  status: string;
  message: string;
  sessionID?: string;
  data?: any;
  token?: string;
  user?: User;
  errcode?: string;
}
