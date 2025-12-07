import { Crypto } from '../models/Crypto';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CryptoInputModel } from '../InputModels/cryptoInputModel';
import { SecurityService } from './security.service';

const url = 'http://localhost:5001/v1/crypto/';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  constructor(
    private http: HttpClient,
    private securityService: SecurityService
  ) { }

  headers: HttpHeaders;

  getAll(): Observable<Crypto[]> {
    this.headers = this.securityService.getAuthentication();

    return this.http.get<Crypto[]>(url, {
      headers: this.headers,
    });
  }

  getAllSymbols(): Observable<Crypto[]> {
    this.headers = this.securityService.getAuthentication();

    return this.http.get<Crypto[]>(url + 'symbols', {
      headers: this.headers,
    });
  }

  post(cryptoInputModel: CryptoInputModel) {
    this.headers = this.securityService.getAuthentication();

    return this.http.post<any>(url, cryptoInputModel, {
      headers: this.headers,
    });
  }

  put(id: string, cryptoInputModel: CryptoInputModel) {
    this.headers = this.securityService.getAuthentication();

    return this.http.put(url + '?id=' + id, cryptoInputModel, {
      headers: this.headers,
    });
  }

  putStatus(id: string) {
    this.headers = this.securityService.getAuthentication();

    return this.http.put(url + 'status?id=' + id, null, {
      headers: this.headers,
    });
  }

  delete(id: string) {
    this.headers = this.securityService.getAuthentication();

    return this.http.delete(url + '?id=' + id, { headers: this.headers });
  }
}
