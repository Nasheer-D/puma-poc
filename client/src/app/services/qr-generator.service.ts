import { Injectable } from '@angular/core';
import { Constants } from '../app.constants';
@Injectable()
export class QrGeneratorService {
  public getQrData(): string {
    const sessionID = localStorage.getItem('sessionID');
    const itemID = localStorage.getItem('itemID');
    return JSON.stringify(
      { url: `${Constants.apiHost}${Constants.apiPrefix}transaction/tx/plain/${sessionID}/${itemID}` });
  }
}
