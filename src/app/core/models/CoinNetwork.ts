import { Crypto } from './Crypto';
import { Entity } from './Entity';
import { Network } from './Network';

export interface CoinNetwork extends Entity {
  coinId: string;
  networkId: string;
  coin?: Crypto;
  network?: Network;
}
