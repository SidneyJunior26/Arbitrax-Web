import { CoinNetwork } from './CoinNetwork';
import { Entity } from './Entity';
import { Opportunity } from './Opportunity';
import { OrderBook } from './OrderBook';

export interface Crypto extends Entity {
  symbol: string;
  name: string;
  active: boolean;
  coinNetworks?: CoinNetwork[];
  orderBooks?: OrderBook[];
  opportunity?: Opportunity[];
}
