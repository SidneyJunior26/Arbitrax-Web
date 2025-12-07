import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SecurityService } from './security.service';
import { OrderBook } from '../models/OrderBook';

const url = 'http://localhost:5001/v1/dolar';

@Injectable({
  providedIn: 'root'
})
export class DolarService {

  constructor(private http: HttpClient,
    private securityService: SecurityService) { }

  headers: HttpHeaders;

  getAverageDolars() {
    this.headers = this.securityService.getAuthentication();

    return this.http.get<any>(
      url,
      {
        headers: this.headers,
      }
    );
  }
}
