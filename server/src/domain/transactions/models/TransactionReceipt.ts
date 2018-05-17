import { TransactionLog } from './TransactionLog';

export interface TransactionReceipt {
    status: boolean;
    transactionHash: string;
    transactionIndex: number;
    blockHash: string;
    blockNumber: number;
    contractAddress: string;
    cumulativeGasUsed: number;
    gasUsed: number;
    logs: TransactionLog[];
}