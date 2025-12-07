import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SecurityService } from './security.service';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import {
  NewUserInputModel,
  UpdateUserInputModel,
} from '../InputModels/userInputModel';

const url = 'http://localhost:5001/v1/user/';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private securityService: SecurityService
  ) { }

  headers: HttpHeaders;

  getAll(): Observable<User[]> {
    this.headers = this.securityService.getAuthentication();

    return this.http.get<User[]>(url, {
      headers: this.headers,
    });
  }

  post(newUserInputModel: NewUserInputModel) {
    this.headers = this.securityService.getAuthentication();

    return this.http.post<any>(url, newUserInputModel, {
      headers: this.headers,
    });
  }

  put(id: string, updateUserInputModel: UpdateUserInputModel) {
    this.headers = this.securityService.getAuthentication();

    return this.http.put(url + '?id=' + id, updateUserInputModel, {
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
