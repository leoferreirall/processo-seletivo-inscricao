import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HashUsuarioCrmRequest } from '../models/HashUsuarioCrmRequest';

@Injectable({
  providedIn: 'root'
})
export class CrmService {
  private urlApiCRM = environment.urlApiCRM;

  constructor(private http: HttpClient) { }

  EnviarEmailViaCrm(modelHash: HashUsuarioCrmRequest) {
    return this.http.post(`${this.urlApiCRM}/v1/Crm/EnviarEmailViaCrm`, modelHash);
  }

  LimparHashCrm(cpf: string){
    return this.http.put(`${this.urlApiCRM}/v1/Crm/LimparHashCrm/${cpf}`, null);
  }

  VerificarUsuarioCRM(cpf: string){
    return this.http.put(`${this.urlApiCRM}/v1/Crm/VerificaUsuarioCRM/${cpf}`, null);
  }
}
