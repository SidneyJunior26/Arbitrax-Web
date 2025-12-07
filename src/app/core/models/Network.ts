import { CoinNetwork } from './CoinNetwork';
import { Entity } from './Entity';

export interface Network extends Entity {
  name: string;
  coinNetworks?: CoinNetwork[];
}
