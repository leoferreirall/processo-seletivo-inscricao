import { Component, Input, OnInit } from '@angular/core';
import { InscricaoService } from '@services/inscricao.service';
import { Response } from 'src/app/models/response.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-cupom-promocional',
  templateUrl: './cupom-promocional.component.html',
  styleUrls: ['./cupom-promocional.component.scss']
})
export class CupomPromocionalComponent implements OnInit {

  detalheInscricao: any = {};


  uidl: number = null;
  uidi: number = null;
  cp: number = null;

  permiteEdicao: boolean;
  disableCupom: any;
  cupomDado: any;
  cupomDadoAux: any;

  model: any = {};
  constructor(
    private service: InscricaoService,
    private NgxSpinnerService: NgxSpinnerService
    ) {
   }

  ngOnInit(): void {
    this.uidl = sessionStorage.getObject('uidl');
    this.uidi = sessionStorage.getObject('uidi');
    this.cp = sessionStorage.getObject('cp');

    if (this.cp && this.uidi)
    {
      this.service.ConsultarDetalheInscricao(this.uidi, this.cp)
        .subscribe((response: Response) => {
          if (response.statusCode === 200) {
            this.detalheInscricao = response.result;

            const {
              permiteEdicao,
            } = response.result;

            this.disableCupom = !response.result.permiteEdicao;
            this.cupomDadoAux = response.result.idConsultorAux == "" || response.result.idConsultorAux == null? undefined: response.result.idConsultorAux;
            this.cupomDado = response.result.idConsultor;

          } else {
            this.NgxSpinnerService.hide('edit');
          }
        });
    }

  }



  getModel(): any {
    return this.model;
  }
  setModel(model: any) {
    this.model = model;
  }
}
