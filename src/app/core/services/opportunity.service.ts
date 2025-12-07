import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SecurityService } from './security.service';
import { Observable } from 'rxjs';
import { Opportunity } from '../models/Opportunity';
import {
  GetAllResponse,
  OpportunityViewModel,
  PotentialEarnings,
} from '../ViewModels/OpportunityViewModel';

const url = 'http://localhost:5001/v1/opportunity/';

@Injectable({
  providedIn: 'root',
})
export class OpportunityService {
  constructor(
    private http: HttpClient,
    private securityService: SecurityService
  ) { }

  headers: HttpHeaders;

  getAll(
    selectedCrypto: string | null,
    selectedExchangeToBuy: string[] | null,
    selectedExchangeToSell: string | null,
    withFee: boolean = true
  ): Observable<GetAllResponse> {
    this.headers = this.securityService.getAuthentication();

    let params = new HttpParams();

    if (selectedCrypto) {
      params = params.append('symbol', selectedCrypto);
    }
    if (selectedExchangeToBuy && selectedExchangeToBuy.length > 0) {
      selectedExchangeToBuy.forEach(exchangeId => {
        params = params.append('exchangesToBuyId', exchangeId);
      });
    }
    if (selectedExchangeToSell) {
      params = params.append('exchangeToSellId', selectedExchangeToSell);
    }

    params = params.append('withFee', withFee);

    return this.http.get<GetAllResponse>(url, {
      headers: this.headers,
      params: params
    });

  }

  getAllHistorical(start: Date, end: Date, selectedCrypto: string | null, maxNegotiationValue: number = 0): Observable<any> {
    this.headers = this.securityService.getAuthentication();

    const formattedStart = this.formatDateToLocal(start);
    const formattedEnd = this.formatDateToLocal(end);

    const params = selectedCrypto ? new HttpParams().set('symbol', selectedCrypto) : new HttpParams();

    return this.http.get<any>(url + 'historical?start=' + formattedStart + '&end=' + formattedEnd + '&maxNegotiationValue=' + maxNegotiationValue, {
      headers: this.headers,
      params: params
    });
  }

  private formatDateToLocal(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // getMonth() retorna meses de 0 a 11
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  approve(id: string) {
    this.headers = this.securityService.getAuthentication();

    return this.http.put<any>(url + "approve/" + id, null, {
      headers: this.headers,
    });
  }

  cancel(id: string) {
    this.headers = this.securityService.getAuthentication();

    return this.http.put<any>(url + "cancel/" + id, null, {
      headers: this.headers,
    });
  }
}
