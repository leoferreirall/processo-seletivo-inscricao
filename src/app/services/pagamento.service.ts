import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { take } from 'rxjs/internal/operators/take';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {
  private urlAPIInsc = environment.urlAPIInsc;


  constructor(private _http: HttpClient) { }

  RealizarPagamento(idLancamento: any, cartao: any): Observable<any> {
    return this._http.put(this.urlAPIInsc + `/v1/pagamentos/RealizarPagamento/${idLancamento}`, cartao).pipe((response: any) => response);
  }

  EmitirBoleto(idLancamento: any): Observable<any> {
    return this._http.put(this.urlAPIInsc + `/v1/pagamentos/EmitirBoleto/${idLancamento}`, null).pipe((response: any) => response);
  }

  ObterImagemBoleto(codPsBoleto: any): Observable<any> {
    return this._http.get(this.urlAPIInsc + `/v1/pagamentos/ObterImagemBoleto/${codPsBoleto}`).pipe((response: any) => response);
  }

  ConsultarTentativaPagamento(codPsLan: number): Observable<any> {
    return this._http.get(`${this.urlAPIInsc}/v1/pagamentos/ConsultarTentativaPagamento/${codPsLan}`).pipe(take(1));
  }
}
