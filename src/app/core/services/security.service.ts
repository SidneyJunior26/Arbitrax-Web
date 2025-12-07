import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginInputModel } from './../InputModels/loginIinputModel';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

const url = 'http://localhost:5001/v1/security/';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  constructor(private router: Router, private http: HttpClient) { }

  tokenKey = 'arbitraxUser';

  getToken(): string {
    let tokenValue = '';

    if (localStorage.getItem(this.tokenKey) != null)
      tokenValue = localStorage.getItem(this.tokenKey)!;

    return tokenValue;
  }

  login(loginInputModel: LoginInputModel) {
    return this.http.post<any>(url, loginInputModel);
  }

  logOutToken() {
    localStorage.removeItem(this.tokenKey);
    this.router.navigateByUrl('/');
    window.location.reload();
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }

  getAuthentication(): HttpHeaders {
    if (this.getToken() != '')
      return new HttpHeaders().set(
        'Authorization',
        'Bearer ' + JSON.parse(this.getToken()).token
      );
    else return new HttpHeaders();
  }
}
