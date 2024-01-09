import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnaliseService {
  private urlAPI: string = environment.urlAPIInsc;
  constructor(private httpClient: HttpClient) {
  }

  upload(formData: any): any {
    return this.httpClient.post<any>(`${this.urlAPI}/v1/ingressos/analise/EnviarArquivos`, formData);
  }

  aceitar(idrequisito: number): any {
    return this.httpClient.put<any>(`${this.urlAPI}/v1/ingressos/analise/AceitarHabilitacao/${idrequisito}`, null);
  }
  solicitarReanalise(idrequisito: number, solicitacao: any): any {
    return this.httpClient.put<any>(`${this.urlAPI}/v1/ingressos/analise/${idrequisito}`, solicitacao);
  }
  downloadArquivoAnalise(idrequisito: number): any {
    return this.httpClient.get(`${this.urlAPI}/v1/ingressos/analise/downloadarquivoanalise/${idrequisito}`);
  }
}
