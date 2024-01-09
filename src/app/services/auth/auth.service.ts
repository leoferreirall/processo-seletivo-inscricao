import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private urlAPI = environment.urlApiUsuarios;

  constructor(private _http: HttpClient, private router: Router) {
  }

  loginService(user: User): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let cpfsemformaracao = user.cpf.replace('.', '').replace('.', '').replace('-', '');

    let body = `grant_type=password&cpf=${cpfsemformaracao}&password=${user.password}`;

    return this._http.post<any>(`${this.urlAPI}/v1/Login/Login`, body, { headers });
  }

  loginToscanaService(cpf: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let body = `grant_type=password&cpf=${cpf}`;

    return this._http.post<any>(`${this.urlAPI}/v1/Login/LoginToscana`, body, { headers });
  }

  alterarSenha(model): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let body = `grant_type=password&password=${model.password}&confirmPassword=${model.confirmPassword}`;

    return this._http.put<any>(this.urlAPI + '/v1/Login/AlterarSenha', body, { headers });
  }

  alterarSenhaCrm(model: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let body = `grant_type=password&password=${model.password}&confirmPassword=${model.confirmPassword}&cpf=${model.cpf}`;

    return this._http.put<any>(this.urlAPI + '/v1/Login/AlterarSenhaCrm', body, { headers });
  }

  gerarSenha(cpf: string): Observable<any> {
    return this._http.get<any>(this.urlAPI + `/v1/Login/GerarSenha/${cpf}`);
  }

  confirmaGerarSenha(cpf: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post<any>(this.urlAPI + '/v1/Login/GerarSenha', { cpf }, { headers: headers });
  }

  getUser() {
    return sessionStorage.getObject('user');
  }

  getToken() {
    var tokenToscana = sessionStorage.getItem('token_access');
    if (tokenToscana) {
      return tokenToscana
    }
    else {
      return this.getUser()?.token;
    }
  }

  getTokenExpirationDate(token: string): Date {
    token = this.getToken()
    const decoded: any = jwt_decode(token);

    if (decoded.exp === undefined) return null;

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token?: string): boolean {
    if (!token) token = this.getToken();
    if (!token) return true;

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }

  loggedIn() {
    return this.getToken();
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/painel-do-candidato']);
  }

}

interface User {
  cpf: string;
  password: string;
}
