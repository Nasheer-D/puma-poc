export class Globals {
    public static GET_BACKEND_HOST(): string {
        // tslint:disable-next-line:no-http-string
        return 'http://192.168.1.50:8080/';
    }

    public static GET_API_PREFIX(): string {
        return 'api/v1/';
    }

    public static GET_INFURA_URL(): string {
        // tslint:disable-next-line:no-http-string
        return 'https://ropsten.infura.io/';
    }

    public static GET_INFURA_KEY(): string {
        return 'ZDNEJN22wNXziclTLijw';
    }
}