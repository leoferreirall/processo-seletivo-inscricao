import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {
  private urlAPI = environment.urlAPIInsc;

  constructor(private _http: HttpClient) { }
  
  ListarLancamentos():Observable<any>{
    return this._http.get(this.urlAPI + '/v1/Lancamento').pipe((response: any) => response);
  }

  ListarLancamentosByInscricao(idInscricao: number):Observable<any>{
    return this._http.get(this.urlAPI + `/v1/Lancamento/ListarLancamentosByInscricao/${idInscricao}`).pipe((response: any) => response);
  }

  GetLancamentoById(idLancamento: any):Observable<any>{
    return this._http.get(this.urlAPI + `/v1/Lancamento/${idLancamento}`).pipe((response: any) => response);
  }
}