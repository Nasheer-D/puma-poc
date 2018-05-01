import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

export class Constants {
    public static apiHost: string = environment.apiHost;
    public static apiPrefix: string = environment.apiPrefix;
    public static serverHost: string = 'http://192.168.1.50:8080';
}
