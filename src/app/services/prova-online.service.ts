import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { ProvaOnline } from '../models/provaonline.model';

@Injectable({
  providedIn: 'root'
})
export class ProvaOnlineService {
  private urlAPI = environment.urlAPIInsc;
  private urlAPIIngresso = environment.urlApiIngresso;

  constructor(private _http: HttpClient) { }


  ConsultarAvaliacaoAprovadaByPessoa(codPsPessoa: any): any {
    return this._http.get(this.urlAPI + `/v1/ingressos/avaliacao/${codPsPessoa}/AvaliacaoAprovada`);
  }

  ConsultarDisponibilidadeProva() {

  }
  ConsultarEnunciado(codpessoa): any {
    return this._http.get(this.urlAPI + `/v1/ingressos/avaliacao/${codpessoa}/enunciado`);
  }
  SalvarProvaRealizada(avaliacao: ProvaOnline): any {
    return this._http.post(this.urlAPI + `/v1/ingressos/avaliacao/`, avaliacao);
  }
  ConsultarUltimaAvaliacao(codPsPessoa): any {
    return this._http.get(this.urlAPIIngresso + `/v1/avaliacao/ConsultarUltimaAvaliacao/${codPsPessoa}`);
  }
}
