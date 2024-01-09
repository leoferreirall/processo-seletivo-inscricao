import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { InscricaoService } from '@services/inscricao.service';
import { Response } from 'src/app/models/response.model';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from '@services/token/session.service';

declare var $: any;

@Component({
  selector: 'app-extrato-campanha',
  templateUrl: './extrato-campanha.component.html',
  styleUrls: ['./extrato-campanha.component.scss']
})
export class ExtratoCampanhaComponent implements OnInit {
  @Input() uidl: number;
  @Input() uidi: number;
  @Input() codbolsa: string = null;
  @Input() loadOnInit: boolean = true;
  @Input() codBolsa: string;

  public mostrarCampanhas = false;

  campanhas: Array<Campanha> = [];

  constructor(
    private service: InscricaoService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    if (this.loadOnInit)
      this.ConsultarExtratoCampanhas();
  }

  private verificaSeIfood() {
    let codBolsa = sessionStorage.getItem('codBolsa');
    return codBolsa == '266';
  }

  ConsultarExtratoCampanhas() {
    this.campanhas = [];
    if(!this.verificaSeIfood()){
      this.mostrarCampanhas = true;
    }
    if (this.uidl || this.uidi) {
      //   this.service.ConsultarExtratoCampanhas(
      //     this.uidi,
      //     this.codbolsa).subscribe((response2: Response) => {
      //       this.campanhas = response2.result;
      //     }, (err: HttpErrorResponse) => {
      //     });
      // } else {
      // this.service.ConsultarExtratoCampanhasLead(
      //   this.uidl,
      //   this.codbolsa).subscribe((response2: Response) => {
      this.service.ConsultarExtratoCampanhas(
        this.uidl,
        this.uidi).subscribe((response2: Response) => {
          this.campanhas = response2.result;
        }, (err: HttpErrorResponse) => {
        });
    }
  }

  onChangeConvenio(codbolsa: string) {
    if (codbolsa)
      this.codbolsa = codbolsa;
    else
      this.codbolsa = null;

    if(codbolsa != sessionStorage.getItem('codBolsa')) {
      this.AlterarBolsa();
    }
    //this.ConsultarExtratoCampanhas();
  }

  close() {
    $('#modal-default').modal().hide();
  }

  AlterarBolsa() {
    var returnCodBolsa;
    var returnCodPsLeadPreferencia;

    this.service.ConsultarBolsa(this.uidl, this.uidi)
    .subscribe((responseBolsa: any) => {
        if (responseBolsa.statusCode === 200 && responseBolsa.result !== null && this.codbolsa == null) {
          if(responseBolsa != null) {
            returnCodBolsa = responseBolsa.result.toString();
          }
        }
        else {
          returnCodBolsa = this.codbolsa;
        }

        if(this.uidi == null || this.uidi == 0) {
          this.service.ConsultarPsLeadPreferencia(this.uidl)
          .subscribe((responseLeadPreferencia: any) => {
            if (responseLeadPreferencia.statusCode === 200 && responseLeadPreferencia.result !== null) {
              if (responseLeadPreferencia != null) {
                returnCodPsLeadPreferencia = responseLeadPreferencia.result.codPsLeadPreferencia;
              }
              else {
                returnCodPsLeadPreferencia = 0;
              }

              this.service.AlterarBolsaLead(this.uidl, returnCodPsLeadPreferencia, returnCodBolsa)
              .subscribe((responseUpdate: any) => {
                this.ConsultarExtratoCampanhas();
                sessionStorage.setItem('codBolsa', returnCodBolsa);
              }, (err: HttpErrorResponse) => {
              });
            }
          },(err: HttpErrorResponse) => {
          });
        }
        else {
          this.service.AlterarBolsaInscricao(this.uidi, returnCodBolsa)
              .subscribe((responseUpdate: any) => {
                this.ConsultarExtratoCampanhas();
                this.toastr.success("Bolsa alterada com sucesso!");
                sessionStorage.setItem('codBolsa', returnCodBolsa);
              }, (err: HttpErrorResponse) => {
              });
        }
    }, (err: HttpErrorResponse) => {
    });
  }
}

interface Campanha {
  desconto: number;
  nome: string;
  parcela: number;
  temDesconto: boolean;
  valor: number;
  valorComDesconto: number;
}
