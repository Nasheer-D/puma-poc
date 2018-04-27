export interface TransactionData {
    callback: string;
    description: string;
    name: string;
    networkid: number;
    to: string;
    value: number;
    signature: string;
}

export enum TxStatus {
    initiated,
    scanned,
    open,
    approved,
    declined,
    cancelled
}
