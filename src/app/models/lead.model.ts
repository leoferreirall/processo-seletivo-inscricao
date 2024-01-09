import { Preferencia } from "./preference.model";

export interface Lead {
    cpf: string;
    nome: string;
    celular: string;
    telefone: string;
    email: string;
    aceitepoliticaprivacidade: boolean;
    aceitepoliticadados: boolean;
    aceitenotificacaopromoemail: boolean;
    aceitenotificacaopromofone: boolean;
    utmsource: string;
    utmcampaign: string;
    latitude: number;
    longitude: number;
    preferencia: Preferencia;
}