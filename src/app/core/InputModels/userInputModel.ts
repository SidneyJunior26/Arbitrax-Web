import { Level } from '../enums/Level';

export interface NewUserInputModel {
  name: string;
  email: string;
  password: string;
  level: Level;
  trial: boolean;
}

export interface UpdateUserInputModel {
  name: string;
  email: string;
  level: Level;
  trial: boolean;
}
