import * as http from 'http';

export class TestHelpers {
  public static ok = (res) => {
    if (res.status !== 200) {
      const status = http.STATUS_CODES[res.status];

      return new Error(`Expected 200, got ${res.status} ${status} with message: ${res.body.message}`);
    }
  };

  public static bad_request = (res) => {
    if (res.status !== 400) {
      const status = http.STATUS_CODES[res.status];

      return new Error(`Expected 400, got ${res.status} ${status} with message: ${res.body.message}`);
    }
  };

  public static not_found = (res) => {
    if (res.status !== 404) {
      const status = http.STATUS_CODES[res.status];

      return new Error(`Expected 404, got ${res.status} ${status} with message: ${res.body.message}`);
    }
  };

  public static server_error = (res) => {
    if (res.status !== 500) {
      const status = http.STATUS_CODES[res.status];

      return new Error(`Expected 500, got ${res.status} ${status} with message: ${res.body.message}`);
    }
  };
}
