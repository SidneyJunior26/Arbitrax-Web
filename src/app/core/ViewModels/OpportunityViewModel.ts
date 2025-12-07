export interface OpportunityViewModel {
  id: string;
  position: number;
  valueToBuy: number;
  valueToSell: number;
  differencePercentage: number;
  cryptoId: string;
  symbol: string;
  name: string;
  exchangeToBuyId: string;
  exchangeToBuyName: string;
  exchangeToSellId: string;
  exchangeToSellName: string;
  hour: string;
  exchangeToBuyUrl: string;
  exchangeToSellUrl: string;
  preApproved: boolean;
  withdrawFee: number;
}

export interface OpportunityHistoricalViewModel {
  position: number;
  valueToBuy: number;
  valueToSell: number;
  differencePercentage: number;
  cryptoId: string;
  symbol: string;
  name: string;
  exchangeToBuyId: string;
  exchangeToBuyName: string;
  exchangeToSellId: string;
  exchangeToSellName: string;
  minutes: number;
  exchangeToBuyUrl: string;
  exchangeToSellUrl: string;
  withdrawFee: number;
  totalCanNegociate: number;
  totalProfit: number;
}

export interface CryptosAnalyticsViewModel {
  name: string;
  value: number;
}

export interface GetAllResponse {
  opportunities: OpportunityViewModel[];
  dolar: number;
}

export interface GetAllAnalytics {
  opportunities: OpportunityViewModel[];
  cryptosAnalytics: CryptosAnalyticsViewModel[];
}

export interface PotentialEarnings {
  potencialValues: number;
  potencialPercentagem: number;
  totalNegotiated: number;
  potencialEarningCryptos: PotencialEarningCrypto[];
}

export interface PotencialEarningCrypto {
  cryptoSymbol: string;
  count: number;
  potencialValues: number;
  totalPotencialPercentagem: number;
  averageTime: string;
  totalNegotiated: number;
}