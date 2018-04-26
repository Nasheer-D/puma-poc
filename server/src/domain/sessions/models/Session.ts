export interface Session {
    sessionID: string;
    txHash: string;
    status: TxStatus;
}

export enum TxStatus {
    scanned,
    open,
    approved,
    declined,
    cancelled
}