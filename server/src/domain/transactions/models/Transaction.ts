import * as unit from 'ethereumjs-units';
import { SignatureCalculator } from '../../../utils/signatureCalculator/SignatureCalculator';

// tslint:disable:variable-name
export class Transaction {
    private _hash: string;
    private _callback: string;
    private _description: string;
    private _name: string;
    private _networkID: number;
    private _to: string;
    private _value: number;
    private _signature: string;

    public constructor(transactionBuilder: TransactionBuilder) {
        this._callback = `callback_url`;
        this._description = transactionBuilder.description;
        this._name = transactionBuilder.name;
        this._networkID = 3;
        this._to = transactionBuilder.to;
        this._value = unit.convert(transactionBuilder.value, 'eth', 'wei');
        this._signature = new SignatureCalculator(this).calculate();
    }

    /**
     * Getter hash
     * @return {string}
     */
    public get hash(): string {
        return this._hash;
    }

    /**
     * Setter hash
     * @param {string} value
     */
    public set hash(value: string) {
        this._hash = value;
    }

    /**
     * Getter callback
     * @return {string}
     */
    public get callback(): string {
        return this._callback;
    }

    /**
     * Getter description
     * @return {string}
     */
    public get description(): string {
        return this._description;
    }

    /**
     * Getter name
     * @return {string}
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Getter networkID
     * @return {number}
     */
    public get networkID(): number {
        return this._networkID;
    }

    /**
     * Getter to
     * @return {string}
     */
    public get to(): string {
        return this._to;
    }

    /**
     * Getter value
     * @return {number}
     */
    public get value(): number {
        return this._value;
    }

    /**
     * Getter signature
     * @return {string}
     */
    public get signature(): string {
        return this._signature;
    }

    public toJSON() {
        return {
            callback: this.callback,
            description: this.description,
            name: this.name,
            networkid: this.networkID,
            to: this.to,
            value: this.value,
            signature: this.signature
        };
    }
}

export class TransactionBuilder {
    private _description: string;
    private _value: number;
    private _name: string;
    private _to: string;

    public build(): Transaction {
        return new Transaction(this);
    }

    /**
     * Getter description
     * @return {string}
     */
    public get description(): string {
        return this._description;
    }

    /**
     * Setter description
     * @param {string} value
     */
    public set description(value: string) {
        this._description = value;
    }

    /**
     * Getter name
     * @return {string}
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Setter name
     * @param {string} value
     */
    public set name(value: string) {
        this._name = value;
    }

    /**
     * Getter value
     * @return {number}
     */
    public get value(): number {
        return this._value;
    }

    /**
     * Setter value
     * @param {number} value
     */
    public set value(value: number) {
        this._value = value;
    }

    /**
     * Getter to
     * @return {string}
     */
    public get to(): string {
        return this._to;
    }

    /**
     * Setter to
     * @param {string} value
     */
    public set to(value: string) {
        this._to = value;
    }

}