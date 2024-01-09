import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InscricaoService {

  private urlAPIInsc = environment.urlAPIInsc;
  private urlApiPsel = environment.urlApiPsel;
  private urlApiLead = environment.urlApiLead;
  constructor(private _http: HttpClient) { }

  ConsultarProcessoSeletivoInCompany(idPs: number, idAreaInteresse: number): any {
    return this._http.get(`${this.urlApiPsel}/v1/processosseletivos/GetPSInCompany`, {
      params: {
        idPs: idPs ? idPs.toString() : '',
        idAreaInteresse: idAreaInteresse ? idAreaInteresse.toString() : ''
    } })
    }
    ConsultarConfirmacaoInscricao(): any {
        return this._http.get(`${this.urlAPIInsc}/v1/inscricao/confirmacao`);
    }
    ConfirmarIncricao(confirmacao: any): any {
        return this._http.post(`${this.urlAPIInsc}/v1/inscricao/confirmacao`, confirmacao);
    }
    ConsultarInscricoes(codpessoa: number): any {
        return this._http.get(`${this.urlAPIInsc}/v1/inscricoes/candidato`);
    }
    ConsultarDetalheInscricao(codinscricao: number, codpessoa: number): any {
        return this._http.get(`${this.urlAPIInsc}/v1/inscricoes/${codinscricao}/detalheInscricao`);
    }
    GetInfoIncricaoByLead(codPsLead: any) {
        return this._http.get(`${this.urlAPIInsc}/v1/inscricoes/${codPsLead}/GetInfoIncricaoByLead`);
    }

    ConsultarInfoInscricao(filtro: any) {
        return this._http.post(`${this.urlAPIInsc}/v1/leads/Get`, filtro);
    }
    ConsultarInfoComplementoInscricao(codinscricao: number = null, codpslead: number = null): any {

        return this._http.get(`${this.urlAPIInsc}/v1/dadoscomplementares`, { params:{
            codPsInscricao: codinscricao ? codinscricao.toString() : '',
            codPsLead: codpslead ? codpslead.toString() : ''
        } });
    }

    ConsultarInscricao(codPsInscricao: number): any {
        return this._http.get(`${this.urlAPIInsc}/v1/inscricoes/${codPsInscricao}`);
    }

    ConsultarProcessosSeletivos(): any {
        return this._http.get(`${this.urlApiPsel}/v1/processosseletivos`);
    }
    ConsultarProcessosSeletivosUnidades(codperlet: string = null, categoriaPs: string = null, formaIngresso: string = null, ignoraFimInscricao: boolean = false): any {
        return this._http.get(`${this.urlApiPsel}/v1/processosseletivos/getpsunidade`, { params: {
            codperlet: codperlet ? codperlet.toString() : '',
            categoriaPs: categoriaPs ? categoriaPs.toString() : '',
            formaIngresso: formaIngresso ? formaIngresso.toString() : '',
            ignoraFimInscricao: ignoraFimInscricao ? '1' : '0'
        } });
    }
    ConsultarCalendarios(filtro: any) {
        return this._http.post(`${this.urlApiPsel}/v1/processosseletivos/getanoletivo`, filtro);
    }
    ConsultarUnidades(filtro: any): any {
        return this._http.post(`${this.urlApiPsel}/v1/unidades`, filtro);
    }
    ConsultarCursos(filtro: any): any {
        return this._http.post(`${this.urlApiPsel}/v1/cursos`, filtro);
    }
    ConsultarCursosTipoHabilitacao(filtro: any) {
        return this._http.post(`${this.urlApiPsel}/v1/cursos/getcursotipohabilitacao`, filtro);
    }
    ConsultarTurnos(filtro: any): any {
        return this._http.post(`${this.urlApiPsel}/v1/turnos`, filtro);
    }
    ConsultarFormasIngresso(filtro: any): any {
        return this._http.post(`${this.urlApiPsel}/v1/formasingressos`, filtro);
    }
    ConsultarEstadosPolo(filtro: any): any {
        return this._http.post(`${this.urlApiPsel}/v1/polos/estados`, filtro);
    }
    ConsultarCidadesPolo(uf: string, filtro: any): any {
        return this._http.post(`${this.urlApiPsel}/v1/polos/${uf}/cidades`, filtro);
    }
    ConsultarPolos(uf: string, cidade: string, filtro: any): any {
        return this._http.post(`${this.urlApiPsel}/v1/polos/${uf}/${cidade}`, filtro);
    }

    CriarInscricao(inscricao: any, codPsInscricao: any): any {
        return this._http.post(`${this.urlAPIInsc}/v1/leads?codPsInscricao=${codPsInscricao}`, inscricao);
    }
    GravarDadosComplementares(complemento: any): any {
        return this._http.post(`${this.urlAPIInsc}/v1/dadoscomplementares`, complemento);
    }

    ConsultarConvenios(filtro: any): any {
        return this._http.post(`${this.urlApiPsel}/v1/convenios`, filtro);
    }
    ConsultarConveniosPorLead(codlead: number): any {
        return this._http.get(`${this.urlApiPsel}/v1/convenios/getbylead?codPsLead=${codlead}`);
    }
    ConsultarConveniosPorInscricao(codinscricao: number): any {
        return this._http.get(`${this.urlApiPsel}/v1/convenios/getbyinscricao?codPsInscricao=${codinscricao}`);
    }
    ConsultarExtratoCampanhasLead(uuid: number, codbolsa: string): Observable<any>{
        return this._http.get(`${this.urlApiPsel}/v1/campanhas?codPsLead=${uuid}${codbolsa === null ? '' : `&codBolsa=${codbolsa}`}`);
    }
    ConsultarExtratoCampanhasInscricao(codinscricao: number, codbolsa: string): any {
        return this._http.get(`${this.urlApiPsel}/v1/campanhas/inscricao/${codinscricao}${codbolsa === null ? '' : `?codBolsa=${codbolsa}`}`);
    }
    ConsultarExtratoCampanhas(codLead: number, codInscricao: number): any {
      return this._http.get(`${this.urlApiPsel}/v1/campanhas/GetCampanhas${codLead === null ? `?codPsLead=0` : `?codPsLead=${codLead}`}${codInscricao === null ? `&codPsInscricao=0` : `&codPsInscricao=${codInscricao}`}`);
    }
    ConsultarExtratoPagamento(codinscricao: number): Observable<any> {
        return this._http.get(`${this.urlAPIInsc}/v1/inscricoes/${codinscricao}/extratopagamento`);
    }
    ConsultarExtratoCampanhasByLead(codPsLead: number, codbolsa: string): any {
        return this._http.get(`${this.urlApiPsel}/v1/campanhas?codPsLead=${codPsLead}${codbolsa === null ? '' : `&codBolsa=${codbolsa}`}`);
    }
    ConsultarParcelasCampanha(filtro: any): any {
        return this._http.post(`${this.urlApiPsel}/v1/campanhas`, filtro);
    }
    ConsultarBolsa(codLead: number, codInscricao: number): any {
      return this._http.get(`${this.urlApiPsel}/v1/campanhas/GetBolsa${codLead === null ? `?codPsLead=0` : `?codPsLead=${codLead}`}${codInscricao === null ? `&codPsInscricao=0` : `&codPsInscricao=${codInscricao}`}`);
    }
    AlterarBolsaLead(codPsLead: number, codPsLeadPreferencia: string, codBolsa: any): Observable<any> {
        const request = new Blob([JSON.stringify(codBolsa)], { type: 'application/json; charset=utf-8' });
        return this._http.put(`${this.urlApiLead}/v1/lead/${codPsLead}/preferences/${codPsLeadPreferencia}/convenio`, request).pipe((response: any) => response);
    }
    AlterarBolsaInscricao(codPsInscricao: number, codBolsa: any): Observable<any> {
      const request = new Blob([JSON.stringify(codBolsa)], { type: 'application/json; charset=utf-8' });
      return this._http.put(`${this.urlAPIInsc}/v1/inscricoes/${codPsInscricao}/convenio`, request).pipe((response: any) => response);
    }
    ConsultarPsLeadPreferencia(codPsLead: number): any {
        return this._http.get(`${this.urlApiLead}/v1/lead/${codPsLead}/preferences`);
    }
    EnviarNotaEnem(enem:any): any {
        return this._http.post(`${this.urlAPIInsc}/v1/ingressos/enem`, enem);
    }
    GetNotaEnemByInscricao(codPsInscricao: any) {
        return this._http.get(`${this.urlAPIInsc}/v1/ingressos/enem/GetByInscricao/${codPsInscricao}`);
    }
}

export class ContentType {

  static options: HttpHeaders | any;

  static setContentType(): any {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=utf-8'
    });

    return this.options = {
      headers: headers
    }
  }

}
