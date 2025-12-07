import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SecurityService } from './security.service';
import { OperationViewModel } from '../ViewModels/OperationViewModel';
import { Observable } from 'rxjs';

const url = 'http://localhost:5001/v1/operation';

@Injectable({
  providedIn: 'root'
})

export class OperationService {
  constructor(
    private http: HttpClient,
    private securityService: SecurityService
  ) { }

  headers: HttpHeaders;

  getAll(
    initialDate: string,
    finalDate: string,
    status: string
  ): Observable<OperationViewModel[]> {
    this.headers = this.securityService.getAuthentication();

    let params = new HttpParams();

    // params = params.append('initialDate', initialDate);
    // params = params.append('finalDate', finalDate);

    if (status != '') {
      params = params.append('status', status);
    }

    return this.http.get<OperationViewModel[]>(url, {
      headers: this.headers,
      params: params
    });
  }

  cancel(id: string) {
    this.headers = this.securityService.getAuthentication();

    return this.http.put<any>(url + "/cancel/" + id, null, {
      headers: this.headers,
    });
  }

}
