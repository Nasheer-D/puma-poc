import * as http from 'http';

export class TestHelpers {
  public static OK = (res: any) => {
    if (res.status !== 200) {
      const status = http.STATUS_CODES[res.status];

      return new Error(`Expected 200, got ${res.status} ${status} with message: ${res.body.message}`);
    }
  };

  public static BAD_REQUEST = (res: any) => {
    if (res.status !== 400) {
      const status = http.STATUS_CODES[res.status];

      return new Error(`Expected 400, got ${res.status} ${status} with message: ${res.body.message}`);
    }
  };

  public static NOT_FOUND = (res: any) => {
    if (res.status !== 404) {
      const status = http.STATUS_CODES[res.status];

      return new Error(`Expected 404, got ${res.status} ${status} with message: ${res.body.message}`);
    }
  };

  public static SERVER_ERROR = (res: any) => {
    if (res.status !== 500) {
      const status = http.STATUS_CODES[res.status];

      return new Error(`Expected 500, got ${res.status} ${status} with message: ${res.body.message}`);
    }
  };
}
