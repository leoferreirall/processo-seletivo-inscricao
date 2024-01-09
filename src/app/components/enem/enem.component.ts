import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { AuthService } from '@services/auth/auth.service';
import { InscricaoService } from '@services/inscricao.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ListItem } from 'src/app/models/list-item.model';
import { Response } from 'src/app/models/response.model';
import { StageEnum } from 'src/app/models/stage.enum';
import { StatusEnum } from 'src/app/models/status.enum';
import Swal from 'sweetalert2';
import { StepsService } from '@services/steps.service';
import { ToastrService } from 'ngx-toastr';
import { EEtapaInscricao } from 'src/app/models/etapa-inscricao.enum';
import { DropDownListComponent } from '../drop-down-list/drop-down-list.component';
import { AcessoToscana } from 'src/app/Shared/AcessoToscana';

@Component({
  selector: 'app-enem',
  templateUrl: './enem.component.html',
  styleUrls: ['./enem.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class EnemComponent implements OnInit {
  @Input('detalheInscricao') detalheInscricao: any = {};
  @Input('statusreq') statusreq: number = null;
  @Input('curso') curso: string = null;
  @Output('complete') complete = new EventEmitter<any>();

  @ViewChild('ano') ano: DropDownListComponent;

  loggedIn: boolean = false;
  uidl: number = null;
  uidi: number = null;
  cp: number = null;
  public acesso: any;

  anos: Array<ListItem> = [];
  model: any = {};

  constructor(
    private inscService: InscricaoService,
    private StepsService: StepsService,
    private authService: AuthService,
    private NgxSpinnerService: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.acesso = AcessoToscana.verificaAcessoToscana();
    var ano = Number(new Date().getFullYear());

    if(Number(new Date().toISOString().substring(5,7)) >= 11){
      ano++;
    }

    for (let i = 0; i <= 13; i++) {
      ano--;

      this.anos.push({ id: ano.toString(), texto: ano.toString(), valor: ano.toString() });
    }

    this.loggedIn = this.authService.loggedIn() ? true : false;
    this.uidl = sessionStorage.getObject('uidl');
    this.uidi = sessionStorage.getObject('uidi');
    this.cp = sessionStorage.getObject('cp');

    var v = sessionStorage.getObject('v');

    const { idFormaIngresso,
      possuiContrato,
      etapaInscricao,
      statusAvaliacao,
      statusAnaliseHistorico,
      statusAnalise,
      statusEnem
    } = this.detalheInscricao;

    if(statusEnem != null && statusEnem > 0){
      this.getEnemByInscricao(this.uidi);
    }
  }

  getEnemByInscricao(codPsInscricao: any){
    this.NgxSpinnerService.show();

    this.inscService.GetNotaEnemByInscricao(codPsInscricao).subscribe((response: Response) => {
      this.NgxSpinnerService.hide();

      if (response.statusCode === 200) {
        this.ano.setSelected(response.result.ano.toString());
      } else if (response.statusCode === 400) {
        this.toastr.error("Erro ao consultar dados do ENEM");
      } else{
        this.toastr.warning("Dados do ENEM nao encontrados");
      }
    });
  }

  onChangeAno(e) {
    this.model.ano = e;
  }

  getModel(): any {
    return this.model;
  }

  onSubmit(model: any) {
    if (!model.ano) {
      this.toastr.warning('Por favor, informe o ano do ENEM.');

      return;
    }

    const request = new EnemRequest();

    request.codpsinscricao = this.uidi;
    request.ano = Number(model.ano);

    this.NgxSpinnerService.show();

    this.inscService.EnviarNotaEnem(request).subscribe((response: Response) => {
      this.NgxSpinnerService.hide();

      if (response.statusCode === 200) {
        Swal.fire({
          title: '<strong style="color:#ff5c00">Suas informações foram enviadas para análise!</strong>',
          text: 'Acompanhe o processo pelo seu painel do candidato.',
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#ff5c00'
        }).then((result) => {
          this.complete.emit();
        });
      }
      else {
        Swal.fire({
          title: '<strong style="color:#ff5c00">Ocorreu um erro durante o processamento!</strong>',
          text: 'Por favor, tente novamente em instantes.',
          icon: 'error',
          showCancelButton: false,
          confirmButtonText: 'ok',
          confirmButtonColor: '#ff5c00'
        }).then((result) => {

        });
      }
    });
  }
}

export default class EnemRequest {
  codpsinscricao: number;
  ano: number;
  notaGeral: number;
  notaRedacao: number;
  notaHumanas: number;
  notaLinguagem: number;
  notaNatureza: number;
  notaMatematica: number;
}
