export class InfoPagamento {
    constructor(
        idPagto: number,
        dataPagamento: Date,
        parcela: number,
        valor: number,
        status: number,
        codigoCielo: number
    ) {
        this.IDPagto = idPagto;
        this.DataPagamento = dataPagamento;
        this.Parcela = parcela;
        this.Valor = valor;
        this.Status = status;
        this.CodigoCielo = codigoCielo;
    }
    IDPagto: number;
    DataPagamento: Date;
    Parcela: number;
    Valor: number;
    Status: number;
    CodigoCielo: number;
    SituacaoPagamento() {
        if (this.Status === 0 || this.Status === 1 || this.Status === 12) {
            return 0; // Processamento
        } else if (this.Status === 2 || this.Status === 4) {
            return 1; // Pago
        }
    }
}