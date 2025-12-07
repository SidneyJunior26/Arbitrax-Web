import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SecurityService } from './security.service';
import { OrderBook } from '../models/OrderBook';
import { Observable } from 'rxjs';

const url = 'http://localhost:5001/v1/orderbook';

@Injectable({
  providedIn: 'root',
})
export class OrderBookService {
  constructor(
    private http: HttpClient,
    private securityService: SecurityService
  ) { }

  headers: HttpHeaders;

  getAll(
    cryptoId: string,
    exchangeToBuyId: string,
    exchangeToSellId: string
  ): Observable<OrderBook[]> {
    this.headers = this.securityService.getAuthentication();

    return this.http.get<OrderBook[]>(
      url +
      '?cryptoId=' +
      cryptoId +
      '&exchangeToBuyId=' +
      exchangeToBuyId +
      '&exchangeToSellId=' +
      exchangeToSellId,
      {
        headers: this.headers,
      }
    );
  }
}
