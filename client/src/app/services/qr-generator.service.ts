import { Injectable } from '@angular/core';
import { Constants } from '../app.constants';
@Injectable()
export class QrGeneratorService {
  public getQrDataForItem(): string {
    const sessionID = localStorage.getItem('sessionID');
    const itemID = localStorage.getItem('itemID');
    return JSON.stringify(
      { url: `${Constants.apiHost}${Constants.apiPrefix}transaction/item/tx/plain/${sessionID}/${itemID}` });
  }

  public getQrDataForPackage(): string {
    const sessionID = localStorage.getItem('sessionID');
    const packageID = localStorage.getItem('packageID');
    return JSON.stringify(
      { url: `${Constants.apiHost}${Constants.apiPrefix}transaction/package/tx/plain/${sessionID}/${packageID}` });
  }
}
