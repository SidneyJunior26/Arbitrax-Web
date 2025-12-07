import { Level } from '../enums/Level';
import { Entity } from './Entity';

export interface User extends Entity {
  name: string;
  email: string;
  password: string;
  level: Level;
  trial: boolean;
  trialExpiration?: Date;
}
