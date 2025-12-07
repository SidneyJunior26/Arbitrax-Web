import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SecurityService } from './security.service';
import { Observable } from 'rxjs';
import { WithdrawFee } from '../models/WithdrawFee';

const url = 'http://localhost:5001/v1/withdrawfee';

@Injectable({
    providedIn: 'root',
})
export class WithdrawFeeService {
    constructor(
        private http: HttpClient,
        private securityService: SecurityService
    ) { }

    headers: HttpHeaders;

    getAll(exchangeToBuyId: string, exchangeToSellId: string, cryptoId: string): Observable<WithdrawFee[]> {
        this.headers = this.securityService.getAuthentication();
        console.log(exchangeToSellId);
        return this.http.get<WithdrawFee[]>(url + '?exchangeToBuyId=' + exchangeToBuyId + '&exchangeToSellId=' + exchangeToSellId + '&cryptoId=' + cryptoId, {
            headers: this.headers,
        });
    }
}