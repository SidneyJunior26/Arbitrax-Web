import { Crypto } from './Crypto';
import { Entity } from './Entity';
import { Exchange } from './Exchange';

export interface Opportunity extends Entity {
  lowerValue: number;
  highestValue: number;
  differencePercentage: number;
  totalCanNegociate: number;
  totalProfit: number;
  coinId: string;
  coin?: Crypto;
  exchangeToBuyId: string;
  exchangeToBuy?: Exchange;
  exchangeToSellId: string;
  exchangeToSell?: Exchange;
}
