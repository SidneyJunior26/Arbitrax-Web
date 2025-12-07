import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SecurityService } from './security.service';
import { Observable } from 'rxjs';
import { Exchange } from '../models/Exchange';
import { ExchangeInputModel } from '../InputModels/exchangeInputModel';

const url = 'http://localhost:5001/v1/exchange/';

@Injectable({
  providedIn: 'root',
})
export class ExchangeService {
  constructor(
    private http: HttpClient,
    private securityService: SecurityService
  ) { }

  headers: HttpHeaders;

  getAll(): Observable<Exchange[]> {
    this.headers = this.securityService.getAuthentication();

    return this.http.get<Exchange[]>(url, {
      headers: this.headers,
    });
  }

  getAllNames(): Observable<Exchange[]> {
    this.headers = this.securityService.getAuthentication();

    return this.http.get<Exchange[]>(url + 'names', {
      headers: this.headers,
    });
  }

  post(exchangeInputModel: ExchangeInputModel) {
    this.headers = this.securityService.getAuthentication();

    return this.http.post<any>(url, exchangeInputModel, {
      headers: this.headers,
    });
  }

  put(id: string, exchangeInputModel: ExchangeInputModel) {
    this.headers = this.securityService.getAuthentication();

    return this.http.put(url + '?id=' + id, exchangeInputModel, {
      headers: this.headers,
    });
  }

  delete(id: string) {
    this.headers = this.securityService.getAuthentication();

    return this.http.delete(url + '?id=' + id, { headers: this.headers });
  }
}
