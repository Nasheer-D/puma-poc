export interface TransactionLog {
    address: string;
    data: string;
    topics: string[];
    logIndex: string;
    transactionIndex: number;
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
}