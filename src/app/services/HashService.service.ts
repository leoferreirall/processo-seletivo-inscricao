import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HashUsuarioCrmRequest } from '../models/HashUsuarioCrmRequest';

@Injectable({
  providedIn: 'root'
})
export class HashServiceService {

  private urlApiCRM = environment.urlApiCRM;

  constructor(private http: HttpClient) { }

  ConsultarHash(modelHash: HashUsuarioCrmRequest) {
    return this.http.post(`${this.urlApiCRM}/v1/Crm/VerificaHashUsuario`, modelHash);
  }

  ConsultarHashCpf(modelHash: HashUsuarioCrmRequest) {
    return this.http.post(`${this.urlApiCRM}/v1/Crm/VerificaHashCpfUsuario`, modelHash);
  }

}
