import { InfoPagamento } from "./info-pagamento.model";
import { EEtapaInscricao } from "./etapa-inscricao.enum";

export class Inscricao {
    constructor(
        codigo: number,
        campus: string,
        curso: string,
        processoSeletivo: string,
        periodoLetivo: string,
        formaIngresso: string,
        turno: string,
        codBolsa: string,
        permiteEdicao: boolean,
        possuiContrato: boolean,
        etapaInscricao: EEtapaInscricao,
        //planoPgtoDiferente: boolean,
        dataAceiteContrato: Date,
        possuiBolsa100: boolean,
        possuiIsencaoInscricao: boolean,
        foiInsento: boolean
    ) {
        this.codigo = codigo;
        this.campus = campus;
        this.curso = curso;
        this.formaIngresso = formaIngresso;
        this.processoSeletivo = processoSeletivo;
        this.periodoLetivo = periodoLetivo;
        this.turno = turno;
        this.codBolsa = codBolsa;
        this.permiteEdicao = permiteEdicao;
        this.possuiContrato = possuiContrato;
        this.EtapaInscricao = etapaInscricao;
        //this.planoPgtoDiferente = planoPgtoDiferente;
        this.DataAceiteContrato = dataAceiteContrato;
        this.possuiBolsa100 = possuiBolsa100;
        this.possuiIsencaoInscricao = possuiIsencaoInscricao;
        this.foiInsento = foiInsento
    }
    codigo: number;
    campus: string;
    curso: string;
    processoSeletivo: string;
    periodoLetivo: string;
    formaIngresso: string;
    turno: string;
    codBolsa: string;
    permiteEdicao: boolean;
    possuiContrato: boolean;
    EtapaInscricao: EEtapaInscricao;
    //planoPgtoDiferente: boolean;
    DataAceiteContrato: Date;
    Pagamento: InfoPagamento;
    possuiBolsa100: boolean;
    possuiIsencaoInscricao: boolean;
    foiInsento: boolean;
}
