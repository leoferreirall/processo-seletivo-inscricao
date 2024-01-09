import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, resolveForwardRef, ViewChild } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
import { ProvaOnlineService } from '@services/prova-online.service';
import { CountdownComponent, CountdownConfig } from 'ngx-countdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Enunciado } from 'src/app/models/enunciado.model';
import { ProvaOnline } from 'src/app/models/provaonline.model';
import { Response } from 'src/app/models/response.model';
import { StatusEnum } from 'src/app/models/status.enum';
import Swal from 'sweetalert2';
import { StepsService } from '@services/steps.service';
import { StageEnum } from 'src/app/models/stage.enum';
import { TipoRequisitoEnum } from 'src/app/models/tipoRequisito.enum';
import { Router, RouterEvent } from '@angular/router';
import { MsgModal } from 'src/app/Shared/Services/MsgModal';
import { AcessoToscana } from 'src/app/Shared/AcessoToscana';

@Component({
  selector: 'app-prova',
  templateUrl: './prova.component.html',
  styleUrls: ['./prova.component.scss']
})
export class ProvaComponent implements OnInit {
  @ViewChild('cd', { static: false }) set content(content: CountdownComponent) {
    if (content) {
      this.countdown = content;

    }
  }
  @Input('detalheInscricao') detalheInscricao: any = {};
  @Input('statusreq') statusreq: number = null;
  @Input('curso') curso: string = null;
  @Output('complete') complete = new EventEmitter<any>();

  public acesso: any;

  provaIniciada: boolean = false;
  redacaoativa: boolean = false;

  enunciado: Enunciado = null;
  prova: ProvaOnline = new ProvaOnline();

  msgcarregando: string = null;
  carregando: boolean = false;

  loggedIn: boolean = false;
  uidl: number = null;
  uidi: number = null;
  cp: number = null;

  status = StatusEnum;
  tipoRequisitoEnum = TipoRequisitoEnum;
  //@ViewChild('cd', { static: false }) private countdown: CountdownComponent;

  private countdown: CountdownComponent;
  config: CountdownConfig = {
    demand: true,
    leftTime: 3600,
    format: 'mm:ss',
    prettyText: (text) => {
      return `<p class="countdown"><i class="material-icons small">access_alarm</i>&nbsp;${text}</p>`;
    }
  };

  constructor(
    private service: ProvaOnlineService,
    private authService: AuthService,
    private StepsService: StepsService,
    private NgxSpinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit() {

    this.acesso = AcessoToscana.verificaAcessoToscana();
    this.loggedIn = this.authService.loggedIn() ? true : false;
    this.uidl = sessionStorage.getObject('uidl');
    this.uidi = sessionStorage.getObject('uidi');
    this.cp = sessionStorage.getObject('cp');

    var v = sessionStorage.getObject('v');

    this.statusreq = this.detalheInscricao.requisito.codPsStatusReq;

    if (!v && !this.acesso) {
      if (this.statusreq == null ||
        this.statusreq == StatusEnum.Pendente ||
        this.statusreq == StatusEnum.DocumentacaoInvalida ||
        this.statusreq == StatusEnum.AguardandoAceiteAnalise ||
        this.statusreq == StatusEnum.Reprovado ||
        this.statusreq == StatusEnum.DocumentacaoPendenteEntrega) {

        if (this.detalheInscricao.processoSeletivo != 'MEDICINA'
          && this.detalheInscricao.requisito.codPsTipoRequisito != TipoRequisitoEnum.AvaliacaoVestibular100) {
          this.GetAvaliacaoAprovadaByPessoa();
        }
      }
    }
  }

  GetAvaliacaoAprovadaByPessoa() {
    this.carregando = true;

    this.NgxSpinnerService.show();

    this.service.ConsultarAvaliacaoAprovadaByPessoa(this.cp).subscribe((response: Response) => {

      if (response.statusCode === 200) {
        var psReqAvaliacao = response.result;
        var CodPsStatusReq = psReqAvaliacao.codPsStatusReq;
        var confgSwal = {} as any;
        this.service.SalvarProvaRealizada(psReqAvaliacao).subscribe((response: Response) => {
          this.NgxSpinnerService.hide();

          this.carregando = false;

          if (response.statusCode == 200) {
            //SE A API RETORNOU STATUSREQ = 14 OU SEJA PENDENTE DE CORREÇÃO ISSO SIGNIFICA QUE O ALUNO JÁ EFETUOU A PROVA, PORÉM NÃO FOI CORRIGIDA
            if (CodPsStatusReq == StatusEnum.PendenteCorrecao) {
              confgSwal.msg = 'Identificamos que você já possui uma avaliação válida aguardando correção, em breve você será notificado sobre o resultado da sua avaliação e poderá prosseguir com seu processo de inscrição.'
              confgSwal.title = '<strong style="color:#ff5c00">Atenção!</strong>'
              confgSwal.icon = 'info'
            }
            else {
              confgSwal.msg = 'Você foi aprovado e poderá continuar com o processo de inscrição.'
              confgSwal.title = '<strong style="color:#ff5c00">Parabéns!</strong>'
              confgSwal.icon = 'success'
            }
            Swal.fire({
              title: confgSwal.title,
              text: confgSwal.msg,
              icon: confgSwal.icon,
              showCancelButton: false,
              confirmButtonText: 'Ok',
              confirmButtonColor: '#ff5c00'
            }).then((result) => {
              this.router.navigate(['/painel-candidato'])
              // this.complete.emit();
            });
          } else if (response.statusCode == 404) {
            this.toastr.warning(response.message);
          } else {
            this.toastr.error(response.message);
          }
        }, (err: HttpErrorResponse) => {

        });
      } else if (response.statusCode === 400) {
        this.NgxSpinnerService.hide();

        this.carregando = false;

        this.toastr.error("Erro ao consultar se existe avaliação aprovada");
      } else {
        this.NgxSpinnerService.hide();

        this.carregando = false;
      }
    });
  }


  IniciarProva() {
    this.provaIniciada = true;

    this.carregando = true;
    const msgs = ['Estamos preparando sua prova...', 'Isso pode demorar alguns minutos...', 'Estamos quase lá...'];
    var imgs = 0;
    this.msgcarregando = 'Estamos preparando sua prova...';

    const node = setInterval(() => {
      if (imgs === 3) { return; }

      this.msgcarregando = msgs[imgs];
      imgs++;
    }, 3000);

    setTimeout(() => {
      this.carregarProva(() => {
        clearInterval(node);

        this.carregando = false;

        do {
          setTimeout(() => {
            if (this.countdown != null)
              this.countdown.begin();
          }, 1000);
        } while (this.countdown === null)
      });
    }, 5000);
  }

  carregarProva(callback: any) {
    this.service.ConsultarEnunciado(this.cp).subscribe((response: Response) => {
      this.enunciado = response.result as Enunciado;
      if (this.enunciado.disponivel) {
        callback();
      }
      else {
        Swal.fire({
          title: '<strong style="color:#ff5c00">Número de tentativas excedido!</strong>',
          text: 'Identificamos que você já realizou 3 tentativas e será necessário aguardar alguns minutos para tentar novamente.',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#ff5c00'
        }).then((result) => {
          this.enunciado = null;
          this.provaIniciada = false;
          this.redacaoativa = false;
        });
      }
    }, (err: HttpErrorResponse) => {
      // console.log(err);
      MsgModal.msgErro('Ocorreu um erro durante o processamento! ', err.message, null);
    });
  }

  handleEvent(e) {
    if (e.action === 'done') {
      Swal.fire({
        title: '<strong style="color:#ff5c00">Tempo encerrado!</strong>',
        text: 'Deseja enviar sua redação para correção ou quer tentar novamente?',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Tentar novamente',
        confirmButtonText: 'Enviar para correção',
        confirmButtonColor: '#ff5c00'
      }).then((result) => {
        if (result.isConfirmed) {
          // Enviar redação para correção
          this.onSubmit();
        } else {
          this.countdown.restart();
          this.enunciado = null;
          this.provaIniciada = false;
          this.redacaoativa = false;
        }
      });
    }
  }

  onSubmit() {
    this.msgcarregando = "Salvando redação...";
    this.carregando = true;

    this.countdown.restart();

    const { codPsEnunciado, codPsPessoa, codPsReqAvaliacao } = this.enunciado;

    this.prova.codpsenunciado = codPsEnunciado;
    this.prova.codpspessoa = codPsPessoa;
    this.prova.codPsReqAvaliacao = codPsReqAvaliacao;

    this.service.SalvarProvaRealizada(this.prova).subscribe((response: Response) => {
      this.NgxSpinnerService.hide();

      if (response.statusCode == 200) {
        Swal.fire({
          title: '<strong style="color:#ff5c00">Redação salva com sucesso!</strong>',
          text: 'Sua redação está na fila de correção e em breve você receberá o resultado, para continuar com sua inscrição.',
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
          confirmButtonColor: '#ff5c00'
        }).then((result) => {
          this.complete.emit();
        });
      } else if (response.statusCode == 404) {
        MsgModal.msgErro('ERRO AO SALVAR A REDAÇÃO', response.message, null);
      } else {
        MsgModal.msgErro('ERRO AO SALVAR A REDAÇÃO', response.message, null);
      }
    }, (err: HttpErrorResponse) => {
      MsgModal.msgErro('ERRO AO SALVAR A REDAÇÃO', err.message, null);
    });
  }

  RemoveExtraSpaces(string)
  {
    return string.replace(/\s\s+/g, ' ');
  }

}
