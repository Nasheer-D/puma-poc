import * as Web3 from 'web3';
import { Injectable } from '@angular/core';

// declare let require: any;
// declare let window: any;

declare global {
  interface Window { web3: any; }
}

window.web3 = window.web3 || {};

@Injectable()
export class Web3Service {
  public web3: any;

  public constructor() {
    this.web3 = window.web3;
  }

  public getWeb3(): any {
    return this.web3;
  }
}
