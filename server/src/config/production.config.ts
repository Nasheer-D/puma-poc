import {Settings} from './settings.interface';

export class ProductionConfig {
  public static get settings(): Settings {
    return {
      host:         '0.0.0.0',
      serverSecret: 'sUp4hS3cr37kE9c0D3'
    };
  }
}
