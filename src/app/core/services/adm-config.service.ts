import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SecurityService } from './security.service';
import { Observable } from 'rxjs';
import { AdmConfig as OpportunityConfig } from '../models/AdmConfig';

const url = 'http://localhost:5001/v1/admconfig/';

@Injectable({
  providedIn: 'root',
})
export class OpportunityConfigService {
  constructor(
    private http: HttpClient,
    private securityService: SecurityService
  ) { }

  headers: HttpHeaders;

  get(): Observable<OpportunityConfig> {
    this.headers = this.securityService.getAuthentication();

    return this.http.get<OpportunityConfig>(url, {
      headers: this.headers,
    });
  }
}
