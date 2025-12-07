import { Entity } from "./Entity";
import { Exchange } from "./Exchange";

export interface WithdrawFee extends Entity {
    fee: number;
    networkCode: string;
    depositEnable: boolean;
    withdrawEnable: boolean;
    tradingEnable: boolean;
    minWithdraw: number;
    maxWithdraw: number;
    exchange?: Exchange;
}