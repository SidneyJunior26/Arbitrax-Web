import { Side } from './../enums/Side';
import { Crypto } from './Crypto';
import { Entity } from './Entity';
import { Exchange } from './Exchange';
import { Opportunity } from './Opportunity';

export interface OrderBook extends Entity {
  side: Side;
  order: number;
  value: number;
  amount: number;
  totalAmount: number;
  totalValue: number;
  coinId: string;
  coin?: Crypto;
  exchangeId: string;
  exchange?: Exchange;
  opportunity?: Opportunity;
  total: number;
}
