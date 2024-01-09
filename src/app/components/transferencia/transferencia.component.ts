import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AnaliseService } from '@services/analise.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ListItem } from 'src/app/models/list-item.model';
import { Response } from 'src/app/models/response.model';
import { StatusEnum } from 'src/app/models/status.enum';
import Swal from 'sweetalert2';
import { StepsService } from '@services/steps.service';
import { StageEnum } from 'src/app/models/stage.enum';
import { DropDownListComponent } from '../drop-down-list/drop-down-list.component';
import { FormaIngresso } from 'src/app/models/formaIngresso.enum';
import { TipoRequisitoEnum } from 'src/app/models/tipoRequisito.enum';
import { saveAs } from 'file-saver';
import { ConvertBaseService } from 'src/app/Shared/Services/ConvertBase.service';
import { AcessoToscana } from 'src/app/Shared/AcessoToscana';

@Component({
  selector: 'app-transferencia',
  templateUrl: './transferencia.component.html',
  styleUrls: ['./transferencia.component.scss'],
})
export class TransferenciaComponent implements OnInit {
  @Input('detalheInscricao') detalheInscricao: any = {};
  @ViewChild('fileUpload', { static: false }) fileUpload: ElementRef;
  @Input('statusreq') statusreq: number = null;
  @Input('idrequisito') idrequisito: number = null;
  @Output('complete') complete = new EventEmitter<any>();

  @ViewChild('qtdSemestres') qtdSemestres: DropDownListComponent;

  motivosreanalise: Array<ListItem> = [];
  listaQtdSemestres: Array<ListItem> = [];
  justificarmotivo: boolean = false;
  solicitarreanalise: boolean = false;
  habilitarreanalise: boolean = false;
  model: any = {};

  loggedIn: boolean = false;
  uidl: number = null;
  uidi: number = null;
  cp: number = null;
  files = [];

  stage = StageEnum;
  formaIngresso = FormaIngresso;
  status = StatusEnum;
  tipoRequisito = TipoRequisitoEnum;

  public acesso: any;

  /* Alterar datas de chamadas e períodos de matrícula do processo seletivo de Medicina */
  primeiraChamadaMedicinaENEM: string = "29 de junho de 2023";
  primeiraChamadaPeriodoMatriculaMedicinaENEM: string = "29 de junho de 2023 a 01 de julho de 2023"; //'Dias 02 e 03 de fevereiro de 2023, das 11h às 21h, e 04 de fevereiro de 2023, das 9h às 12h';
  segundaChamadaMedicinaENEM: string = "03 de julho de 2023";
  segundaChamadaPeriodoMatriculaMedicinaENEM: string = "03 a 05 de julho de 2023"; //'06 a 08 de fevereiro de 2023, das 11h às 21h';
  // primeiraNovaChamadaMedicinaENEM: string = "dia de mês de ano";
  // primeiraNovaChamadaPeriodoMatriculaMedicinaENEM: string = "dia a dia de mês de ano";
  // segundaNovaChamadaMedicinaENEM: string = "dia de mês de ano";
  // segundaNovaChamadaPeriodoMatriculaMedicinaENEM: string = "dia a dia de mês de ano"; // Horário de atendimento: Segunda a sexta das 11h às 21h e sábado das 09h às 12h
  primeiraChamadaMedicinaOutros: string = "14 de julho de 2023";
  primeiraChamadaPeriodoMatriculaMedicinaOutros: string = "14 a 18 de julho de 2023"; //"Dias 01, 02 ou 03 de fevereiro de 2023, das 11h às 21h";
  segundaChamadaMedicinaOutros: string = "19 de julho de 2023";
  segundaChamadaPeriodoMatriculaMedicinaOutros: string = "19 a 21 de julho de 2023"; //"Dias 06, 07 ou 08 de fevereiro de 2023, das 11h às 21 horas";

  constructor(
    private StepsService: StepsService,
    private analiseService: AnaliseService,
    private NgxSpinnerService: NgxSpinnerService,
    private convertBase: ConvertBaseService
  ) {}
  ngOnInit(): void {

    this.acesso = AcessoToscana.verificaAcessoToscana();
    this.uidi = sessionStorage.getObject('uidi');

    var v = sessionStorage.getObject('v');

    this.motivosreanalise.push(
      {
        id: '1',
        texto: 'Definição de Semestre',
        valor: 'Definição de Semestre',
      },
      {
        id: '2',
        texto: 'Eliminação de Disciplinas',
        valor: 'Eliminação de Disciplinas',
      },
      { id: '0', texto: 'Outros', valor: 'Outros' }
    );

    for (let i = 1; i < 13; i++) {
      this.listaQtdSemestres.push({
        id: i,
        texto: i + (i == 1 ? ' semestre' : ' semestres'),
        valor: i,
      });
    }

    this.detalheInscricao.stage = this.StepsService.currentStep$.value.stage;

    this.idrequisito = this.detalheInscricao.requisito.codPsReq;
    this.statusreq = this.detalheInscricao.requisito.codPsStatusReq;
  }

  ngAfterViewInit() {
    if (this.fileUpload) {
      const fileUpload = this.fileUpload.nativeElement;
      fileUpload.onchange = () => {
        for (let index = 0; index < fileUpload.files.length; index++) {
          const file = fileUpload.files[index];
          this.files.push({ data: file, inProgress: false, progress: 0 });
        }
      };
    }
  }

  uploadFiles() {
    if (this.files.length <= 0) {
      Swal.fire({
        title: '',
        text: 'Por favor, selecione um arquivo.',
        icon: 'error',
        showCancelButton: false,
        confirmButtonText: 'ok',
        confirmButtonColor: '#ff5c00',
      }).then((result) => { });
    } else {
      this.NgxSpinnerService.show();

      const formData = new FormData();

      this.files.forEach((file) => {
        formData.append('files', file.data);
      });

      formData.append('codPsInscricao', String(this.uidi));
      if (
        this.detalheInscricao.processoSeletivo === 'MEDICINA' &&
        this.detalheInscricao.idFormaIngresso != 4
      )
        formData.append(
          'qtdSemestres',
          String(this.qtdSemestres?.valorselecionado || 0)
        );
      formData.append(
        'tipoRequisito',
        this.detalheInscricao.requisito.codPsTipoRequisito
      );

      this.analiseService.upload(formData).subscribe((response: Response) => {
        this.NgxSpinnerService.hide();

        if (response.statusCode === 200) {
          Swal.fire({
            title:
              '<strong style="color:#ff5c00">Seus documentos foram enviados para análise!</strong>',
            text: 'Acompanhe o processo pelo seu painel do candidato.',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            confirmButtonColor: '#ff5c00',
          }).then((result) => {
            this.complete.emit();
          });
        } else {
          Swal.fire({
            title:
              '<strong style="color:#ff5c00">Ocorreu um erro durante o processamento!</strong>',
            text:
              response.message != ''
                ? response.message
                : 'Por favor, tente novamente em instantes.',
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'ok',
            confirmButtonColor: '#ff5c00',
          }).then((result) => { });
        }
      });
    }
  }

  onSubmitReanalise() {
    if (this.idrequisito) {
      if (this.justificarmotivo && !this.model.justificativa) {
        Swal.fire({
          text: 'Por favor, informe o motivo da reanálise.',
          icon: 'error',
          showCancelButton: false,
          confirmButtonText: 'ok',
          confirmButtonColor: '#ff5c00',
        }).then((result) => { });

        return;
      }
      const solicitacao = {
        CodPsReqAnalise: this.idrequisito,
        CodPsStatusReq: this.status.ReanaliseCoordenador,
        Comentario: this.justificarmotivo
          ? this.model.justificativa
          : this.model.motivo,
      };

      this.analiseService
        .solicitarReanalise(this.idrequisito, solicitacao)
        .subscribe((response: Response) => {
          Swal.fire({
            text: 'Recebemos sua solicitação de reanálise e, em breve, você receberá o resultado.',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'ok',
            confirmButtonColor: '#ff5c00',
          }).then((result) => {
            this.complete.emit();
          });
        });
    }
  }

  onClick() {
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.click();
  }
  onDeleteClick(i) {
    this.files.splice(i, 1);
  }

  onClickAceiteAnalise() {
    if (this.idrequisito) {
      this.analiseService
        .aceitar(this.idrequisito)
        .subscribe((response: Response) => {
          if (response.statusCode === 200) this.complete.emit();
          else
            Swal.fire({
              title:
                '<strong style="color:#ff5c00">Ocorreu um erro durante o processamento!</strong>',
              text: 'Por favor, tente novamente em instantes.',
              icon: 'error',
              showCancelButton: false,
              confirmButtonText: 'ok',
              confirmButtonColor: '#ff5c00',
            }).then((result) => { });
        });
    }
  }

  onClickReanalise() {
    this.solicitarreanalise = true;
  }

  onChangeMotivo(e) {
    this.justificarmotivo = e === 'Outros';
    this.model.motivo = e;
  }

  onChangeOpcao(e) {
    if (e) {
      this.model.reanalise = false;
    } else {
      this.model.aceiteanalise = false;
      this.justificarmotivo = false;
      this.solicitarreanalise = false;
    }
  }

  onClickDownloadArquivo() {
    this.NgxSpinnerService.show();

    this.analiseService
      .downloadArquivoAnalise(this.idrequisito)
      .subscribe((response: Response) => {
        this.NgxSpinnerService.hide();

        if (response.statusCode == 200) {
          const arquivo = response.result;
          const { base64, nome: fileName } = arquivo;

          let file = this.convertBase.convertBase64ToFile(base64, fileName);
          saveAs(file, fileName);
        }
      });
  }
}
