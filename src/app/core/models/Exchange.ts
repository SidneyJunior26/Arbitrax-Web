import { Entity } from './Entity';
import { Opportunity } from './Opportunity';
import { OrderBook } from './OrderBook';

export interface Exchange extends Entity {
  name: string;
  exchangeUrl: string;
  apiUrl: string;
  apiKey: string;
  apiSecretKey: string;
  fee: number;
  opportunitiesToBuy?: Opportunity;
  opportunitiesToSell?: Opportunity;
  orderBook?: OrderBook[];
}
