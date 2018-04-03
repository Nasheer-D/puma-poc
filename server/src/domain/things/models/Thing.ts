// tslint:disable:variable-name

import * as shortid from 'shortid';

export class Thing {
  private _thingID: string;
  private _description: string;

  public constructor(thingBuilder: ThingBuilder) {
    this._thingID = shortid.generate();
    this._description = thingBuilder.description;
  }

  public get thingID(): string {
    return this._thingID;
  }

  public get description(): string {
    return this._description;
  }

  public toJSON(): any {
    return {
      thingID: this.thingID,
      description: this.description
    };
  }
}

export class ThingBuilder {
  private _description: string;

  public build(): Thing {
    return new Thing(this);
  }

  public get description(): string {
    return this._description;
  }

  public set description(value: string) {
    this._description = value;
  }
}

export interface IThing {
  thingID: string;
  description: string;
}
