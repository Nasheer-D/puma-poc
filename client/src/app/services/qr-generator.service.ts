import { Injectable } from '@angular/core';
import { Constants } from '../app.constants';

@Injectable()
export class QrGeneratorService {

  public getQrData(sessionId: string, itemId: string): string {
    return JSON.stringify(
      { url: `${Constants.apiHost}${Constants.apiPrefix}transaction/tx/plain/${sessionId}/${itemId}` });
  }
}
