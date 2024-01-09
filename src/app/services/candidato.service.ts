import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
//import { timeStamp } from 'console';

@Injectable({
    providedIn: 'root'
})
export class CandidatoService {
    private urlAPIPsel = environment.urlApiPsel;
    private urlAPIInsc = environment.urlAPIInsc;

    constructor(private _http: HttpClient) { }

    ListarNacionalidades(): any {
        return this._http.get(`${this.urlAPIPsel}/v1/Nacionalidade`);
    }
    ListarEstadosNatais(codNacionalidade: any): any {
        return this._http.post(`${this.urlAPIPsel}/v1/EstadoNatal`, { codNacionalidade });
    }
    ListarNaturalidades(codNacionalidade: any, uf: any): any {
        return this._http.post(`${this.urlAPIPsel}/v1/Naturalidade`, { codNacionalidade, uf });
    }
    ConsultarEnderecoPorCep(cep: any): any {
        return this._http.post(`${this.urlAPIPsel}/v1/EnderecoPorCep`, { cep });
    }
    ConsultarEnderecoPorRua(endereco: any): any {
        return this._http.post(`${this.urlAPIPsel}/v1/EnderecoPorRua`, { endereco });
    }
    ListarEstados(idPais: any): any {
        return this._http.post(`${this.urlAPIPsel}/v1/EnderecoEstado`, { idPais });
    }
    ListarCidades(idPais: any, uf: any): any {
        return this._http.post(`${this.urlAPIPsel}/v1/EnderecoCidade`, { idPais, uf });
    }
    ListarBairros(idPais: any, uf: any, codlocalidade: any, codmunicipio: any): any {
        return this._http.post(`${this.urlAPIPsel}/v1/EnderecoBairro`, { idPais, uf, codlocalidade, codmunicipio });
    }

    CadastrarDadosPessoais(candidato: any): any {
        return this._http.post(`${this.urlAPIInsc}/v1/candidato`, candidato);
    }
    ConsultarDadosCadastrais(): any {
        return this._http.get(`${this.urlAPIInsc}/v1/candidato`);
    }
    CadastrarDeficiencias(codpessoa: any, deficiencias: any): any {
        return this._http.put(`${this.urlAPIInsc}/v1/candidato/${codpessoa}/deficiencias`, deficiencias);
    }
    ConsultarDeficiencias(codpessoa: any): any {
        return this._http.get(`${this.urlAPIInsc}/v1/candidato/${codpessoa}/deficiencias`);
    }
    CadastrarTelefones(codpessoa: any, telefone: any): any {
        return this._http.post(`${this.urlAPIInsc}/v1/candidato/${codpessoa}/telefones`, telefone);
    }
    ConsultarTelefones(codpessoa: any): any {
        return this._http.get(`${this.urlAPIInsc}/v1/candidato/${codpessoa}/telefones`);
    }
    CadastrarEmails(codpessoa: any, emails: any): any {
        return this._http.post(`${this.urlAPIInsc}/v1/candidato/${codpessoa}/emails`, emails);
    }
    ConsultarEmails(codpessoa: any): any {
        return this._http.get(`${this.urlAPIInsc}/v1/candidato/${codpessoa}/emails`);
    }
    CadastrarEndereco(codpessoa: any, endereco: any): any {
        return this._http.post(`${this.urlAPIInsc}/v1/candidato/${codpessoa}/endereco`, endereco);
    }
    ConsultarEndereco(codpessoa: any): any {
        return this._http.get(`${this.urlAPIInsc}/v1/candidato/${codpessoa}/endereco`);
    }
    CadastrarResponsavel(codpessoa: any, responsavel: any) {
        return this._http.post(`${this.urlAPIInsc}/v1/candidato/${codpessoa}/responsavel`, responsavel);
    }
    CadastrarEnderecoResponsavel(codpessoa: any, codresponsavel: any, endereco: any): any {
        return this._http.post(`${this.urlAPIInsc}/v1/candidato/${codpessoa}/responsavel/${codresponsavel}/endereco`, endereco);
    }

    ConsultarConfirmacaoDados(codpessoa: any): any {
        return this._http.get(`${this.urlAPIInsc}/v1/candidato/${codpessoa}/confirmacao`);
    }

    ConsultarInfoAcesso(){
        return this._http.get(`${this.urlAPIInsc}/v1/candidato/informacaoacesso`);
    }

    GetResponsavel(){
        return this._http.get(`${this.urlAPIInsc}/v1/candidato/GetResponsavel`);
    }

    ConsultarEnderecoResponsavel(codPsPessoa: any, codPsPessoaResponsavel: any){
        return this._http.get(`${this.urlAPIInsc}/v1/candidato/${codPsPessoa}/responsavel/${codPsPessoaResponsavel}/endereco/GetByPessoa`);
    }

    ConsultarDadosCadastraisCompleto(codPsPessoa: any){
        return this._http.get(`${this.urlAPIInsc}/v1/candidato/${codPsPessoa}/confirmacao`);
    }

    AtualizarDadosCadastrais(candidato: any): any {
        return this._http.put(`${this.urlAPIInsc}/v1/candidato`, candidato);
    }

    AtualizarEndereco(codPsPessoa: any, endereco: any): any {
        return this._http.put(`${this.urlAPIInsc}/v1/candidato/${codPsPessoa}/endereco`, endereco);
    }

    AtualizarTelefone(codPsPessoa: any, telefone: any): any {
        return this._http.put(`${this.urlAPIInsc}/v1/candidato/${codPsPessoa}/telefones`, telefone);
    }

    AtualizarEmail(codPsPessoa: any, email: any): any {
        return this._http.put(`${this.urlAPIInsc}/v1/candidato/${codPsPessoa}/emails`, email);
    }

    AtualizarDeficiencias(codPsPessoa: any, deficiencia: any): any {
        return this._http.put(`${this.urlAPIInsc}/v1/candidato/${codPsPessoa}/deficiencias`, deficiencia);
    }
}