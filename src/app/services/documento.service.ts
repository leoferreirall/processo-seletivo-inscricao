import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DocumentoService {
    private urlAPIInsc = environment.urlAPIInsc;

    constructor(private _http: HttpClient) { }

    public ConsultarDocumento(codPsTipoDoc: number): Observable<Blob> {   
        return this._http.get(`${this.urlAPIInsc}/v1/Documentos/GetPdfLead?codPsTipoDoc=${codPsTipoDoc}`, { responseType: 'blob' });
    }
}