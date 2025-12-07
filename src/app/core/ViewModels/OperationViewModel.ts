export interface OperationViewModel {
    symbol: string;
    buy: string;
    sell: string;
    lowerValue: number;
    highestValue: number;
    profit: number;
    diffMinutes: number;
    registerDate: Date;
    operationStatus: number;
    opportunityId: string;
    preApproved: number;
}