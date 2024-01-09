import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {
  private urlApiInscricao = environment.urlAPIInsc;
  constructor(private _http: HttpClient) { }

  ConsultarContrato(codinscricao: number, codBolsa?: number, codPsUsuario?: number): Observable<any> {
    if (!codBolsa) {
      codBolsa = 0;
    }
    return this._http.get(
      `${this.urlApiInscricao}/v1/contratos/html?CodTipoDocumento=4&CodInscricao=${codinscricao}&CodBolsa=${codBolsa}&CodPsUsuario=${codPsUsuario}`);
  }

  DownloadContrato(codinscricao: number): Observable<any> {
    return this._http.get<Blob>(
      `${this.urlApiInscricao}/v1/contratos/pdf?CodTipoDocumento=4&CodInscricao=${codinscricao}`,
      { responseType: 'blob' as 'json' });
  }

  DownloadContratoAceito(codinscricao: number): Observable<any> {
    return this._http.get<Blob>(
      `${this.urlApiInscricao}/v1/contratos/PegarContratoAceito?CodTipoDocumento=4&CodInscricao=${codinscricao}`,
      { responseType: 'blob' as 'json' });
  }

  PegarContratoAceitoSalvo(codinscricao: number): Observable<any> {
    return this._http.get<Blob>(
      `${this.urlApiInscricao}/v1/contratos/PegarContratoAceitoSalvo?CodTipoDocumento=4&CodInscricao=${codinscricao}`,
      { responseType: 'blob' as 'json' });
  }

  AceitarContrato(codinscricao: number, codaceitedoc: number, codPsDoc?: number): Observable<any> {
    const aceite = {
      codPsInscricao: codinscricao,
      codColigada: 1,
      codPsTipoDoc: 4,
      codPsAceiteDoc: codaceitedoc,
      codPsDoc: codPsDoc
    };

    return this._http.post(
      `${this.urlApiInscricao}/v1/contratos/aceitarContrato`,
      aceite);
  }
}
