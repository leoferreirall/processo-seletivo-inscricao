import { HttpErrorResponse } from '@angular/common/http';
import { ReturnStatement, THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { faL, faSliders } from '@fortawesome/free-solid-svg-icons';
import { EventEmitterService } from '@services/event-emitter.service';
import { InscricaoService } from '@services/inscricao.service';
import { PagamentoService } from '@services/pagamento.service';
import { StepsService } from '@services/steps.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { iif } from 'rxjs';
import { ContratoComponent } from 'src/app/components/contrato/contrato.component';
import { PagamentoBoletoComponent } from 'src/app/components/pagamento-boleto/pagamento-boleto.component';
import { PagamentoCartaoComponent } from 'src/app/components/pagamento-cartao/pagamento-cartao.component';
import { PlanosCondicoesComponent } from 'src/app/components/planos-condicoes/planos-condicoes.component';
import { Campanha } from 'src/app/models/campanha.model';
import { Documento } from 'src/app/models/documento.model';
import { RetornoTelaPagamentoEnum } from 'src/app/models/Enums/RetornoTelaPagamentoEnum.enum';
import { EEtapaInscricao } from 'src/app/models/etapa-inscricao.enum';
import { ExtratoPagamento } from 'src/app/models/extrato-pagamento.model';
import { InfoPagamento } from 'src/app/models/info-pagamento.model';
import { Inscricao } from 'src/app/models/inscricao.model';
import { Response } from 'src/app/models/response.model';
import { StageEnum } from 'src/app/models/stage.enum';
import { StatusEnum } from 'src/app/models/status.enum';
import { AcessoToscana } from 'src/app/Shared/AcessoToscana';

@Component({
  selector: 'app-pagamento',
  templateUrl: './pagamento.component.html',
  styleUrls: ['./pagamento.component.scss']
})
export class PagamentoComponent implements OnInit {
  @ViewChild(ContratoComponent) modal: ContratoComponent;
  @ViewChild(PagamentoCartaoComponent) modalpag: PagamentoCartaoComponent;
  @ViewChild(PagamentoBoletoComponent) modalBoleto: PagamentoBoletoComponent;
  @ViewChild(PlanosCondicoesComponent, { static: true }) planos: PlanosCondicoesComponent;
  // private contentPlanos: PlanosCondicoesComponent;

  // @ViewChild('planos') set content(content: PlanosCondicoesComponent) {
  //   if (content) {
  //     this.contentPlanos = content;

  //     if (this.inscricao && this.inscricao.codBolsa)
  //       this.contentPlanos.onChangeConvenio(this.inscricao.codBolsa);
  //     else
  //       this.contentPlanos.onChangeConvenio(null);

  //     this.loadingCampanha = false;
  //   }
  // }

  stageEnum = StageEnum;
  stage: StageEnum;

  permiteEdicao: boolean;

  pendenteaceitecontrato: boolean = true;
  pendentepagamento: boolean = true;

  uidl: number = null;
  uidi: number = null;
  codpessoa: number = null;

  detalheInscricao: any = {};
  inscricao: Inscricao = null;
  campanhas: Array<Campanha> = [];
  contrato: Documento = null;
  extratoPagamento: ExtratoPagamento = null;

  aceitecontrato: boolean = false;

  loadingInscricao: boolean = true;

  loadingContrato: boolean = true;
  loadingCampanha: boolean = true;

  exibirMsg: boolean = false;

  currentDate: Date = new Date();

  eventMessage: string;
  eventMatriculaMessage: string;

  contratoGerado: boolean = false;

  aceiteIndisponivel: boolean = false;
  aceiteDisponivel: boolean = false;
  pagamentoPendente: boolean = false;
  pagamentoRecebido: boolean = false;
  processandoPagamento: boolean = false;
  matriculado: boolean = false;

  showalert: boolean = false;

  habilitaAceite: boolean = false;

  showContrato: boolean = false;
  showPagamento: boolean = false;
  showInfoPagamento: boolean = false;

  formaPagamento: number = 2;

  insentoInscricao: boolean = false;

  verificaTentativaPagamento: boolean = false;

  etapaInscricao: any;

  public acesso: any;

  constructor(
    public service: InscricaoService,
    public StepsService: StepsService,
    public NgxSpinnerService: NgxSpinnerService,
    public pagamentoService: PagamentoService,
    public toasterService: ToastrService
  ) { }

  ngOnInit(): void {
    this.uidi = sessionStorage.getObject('uidi');
    this.uidl = sessionStorage.getObject('uidl');
    this.codpessoa = sessionStorage.getObject('cp');

    //PASSANDO PELA FUNÇÃO NA QUAL IRÁ VERIFICAR SE O CANDIDATO EFETUOU UMA TENTATIVA DE PAGAMENTO E O MESMO ESTÁ PENDENTE NA CIELO, SE SIM ENTÃO SETAR A ETAPA DA INSCRIÇÃO
    //COMO PROCESSANDO PAGAMENTO
    this.NgxSpinnerService.show();

    // if (this.StepsService.getCurrentStepObj().value.stage == this.stageEnum.Pagamento) {
    //   this.verificaTentativaPendente(this.uidi);
    // }
    // else {
    //   this.ConsultarInscricao(() => {
    //     this.loadingInscricao = false;
    //     this.PossuiAceite();
    //     this.NgxSpinnerService.hide();
    //     this.acesso = AcessoToscana.verificaAcessoToscana();
    //   });
    // }
    this.ConsultarInscricao(() => {
      this.loadingInscricao = false;
      this.PossuiAceite();
      this.NgxSpinnerService.hide();
      this.acesso = AcessoToscana.verificaAcessoToscana();
    });

  }

  ConsultarInscricao(callback: any) {
    this.service.ConsultarDetalheInscricao(this.uidi, this.codpessoa)
      .subscribe((response: Response) => {
        var v = sessionStorage.getObject('v');

        this.stage = this.StepsService.getCurrentStepObj().value.stage;

        this.detalheInscricao = response.result;
        const {
          codPsInscricao,
          campus,
          curso,
          processoSeletivo,
          idFormaIngresso,
          formaIngresso,
          periodoLetivo,
          turno,
          permiteEdicao,
          codBolsa,
          possuiAprovacao,
          possuiContrato,
          possuiLancamentoPendente,
          possuiTaxaInscricao,
          possuiTaxaInscricaoPendente,
          possuiBolsa100,
          etapaInscricao,
          //planoPgtoDiferente,
          infoPagamento,
          infoPagamentoTaxaInscricao,
          dataAceiteContrato,
          statusAvaliacao,
          statusAnaliseHistorico,
          statusAnalise,
          statusEnem,
          msgMatricula,
          possuiIsencaoInscricao,
          foiInsento
        } = this.detalheInscricao;

        this.permiteEdicao = permiteEdicao;

        if (this.detalheInscricao.processoSeletivo == 'MEDICINA') {
          this.formaPagamento = 2;
        }

        if (!possuiTaxaInscricaoPendente && !v) {

          if (statusEnem == StatusEnum.Pendente ||
            statusEnem == StatusEnum.DocumentacaoInvalida ||
            statusEnem == StatusEnum.AguardandoAceiteAnalise ||
            statusEnem == StatusEnum.Reprovado ||
            statusEnem == StatusEnum.DocumentacaoInvalida) {
            this.StepsService.setCurrentStepByStage(StageEnum.Enem);
          }
          else if (statusAvaliacao == StatusEnum.Pendente ||
            statusAvaliacao == StatusEnum.DocumentacaoInvalida ||
            statusAvaliacao == StatusEnum.AguardandoAceiteAnalise ||
            statusAvaliacao == StatusEnum.Reprovado ||
            statusAvaliacao == StatusEnum.DocumentacaoInvalida) {
            this.StepsService.setCurrentStepByStage(StageEnum.Avaliacao);
          }
          else if (statusAnaliseHistorico == StatusEnum.Pendente ||
            statusAnaliseHistorico == StatusEnum.DocumentacaoInvalida ||
            statusAnaliseHistorico == StatusEnum.AguardandoAceiteAnalise ||
            statusAnaliseHistorico == StatusEnum.Reprovado ||
            statusAnaliseHistorico == StatusEnum.DocumentacaoPendenteEntrega) {
            this.StepsService.setCurrentStepByStage(StageEnum.Historico);
          }
          else if (statusAnalise == StatusEnum.Pendente ||
            statusAnalise == StatusEnum.DocumentacaoInvalida ||
            statusAnalise == StatusEnum.AguardandoAceiteAnalise ||
            statusAnalise == StatusEnum.Reprovado ||
            statusAnalise == StatusEnum.DocumentacaoInvalida) {
            if (idFormaIngresso == 1) {
              this.StepsService.setCurrentStepByStage(StageEnum.PortadorDiploma);
            } else if (idFormaIngresso == 3) {
              this.StepsService.setCurrentStepByStage(StageEnum.Transferencia);
            } else if (idFormaIngresso == 4) {
              this.StepsService.setCurrentStepByStage(StageEnum.Documentacao);
            }
          }
        }

        this.inscricao = new Inscricao(
          codPsInscricao,
          campus,
          curso,
          processoSeletivo,
          periodoLetivo,
          formaIngresso,
          turno,
          codBolsa,
          permiteEdicao,
          possuiContrato,
          etapaInscricao,
          //planoPgtoDiferente,
          dataAceiteContrato,
          possuiBolsa100,
          possuiIsencaoInscricao,
          foiInsento);

        if (infoPagamento) {
          const {
            idPagto,
            dataPagamento,
            parcela,
            valor,
            status,
            codigoCielo
          } = infoPagamento;
          this.inscricao.Pagamento = new InfoPagamento(
            idPagto,
            dataPagamento,
            parcela,
            valor,
            status,
            codigoCielo
          );
        }

        if (infoPagamentoTaxaInscricao && this.stage == StageEnum.TaxaInscricao) {
          const {
            idPagto,
            dataPagamento,
            parcela,
            valor,
            status,
            codigoCielo
          } = infoPagamentoTaxaInscricao;
          this.inscricao.Pagamento = new InfoPagamento(
            idPagto,
            dataPagamento,
            parcela,
            valor,
            status,
            codigoCielo
          );
        }
        this.extratoPagamento = null;

        this.ResetarIndicadores();

        if (this.inscricao.EtapaInscricao !== EEtapaInscricao.AceiteIndisponivel || this.stage == StageEnum.TaxaInscricao) {
          if (this.inscricao.EtapaInscricao === EEtapaInscricao.Matriculado) {
            this.eventMatriculaMessage = 'Parabéns! Você está matriculado na FAM.';
            this.eventMessage = 'Parabéns! Você está matriculado na FAM.';
            this.matriculado = true;
            this.pagamentoRecebido = true;
            this.aceiteDisponivel = false;

            callback();
          }
          else if (this.inscricao.EtapaInscricao === EEtapaInscricao.PagamentoRecebido) {
            if (this.inscricao.possuiBolsa100) {
              this.eventMessage = 'Estamos preparando seu acesso à FAM.';
            }
            else {
              if (!this.inscricao.foiInsento) {
                this.eventMessage = 'Recebemos seu pagamento e estamos preparando seu acesso à FAM.';
              }
              else {
                this.eventMessage = 'Pagamento da taxa de inscrição foi insenta, e estamos preparando seu acesso à FAM';
              }
            }

            // Exibir mensagem de pago
            this.pagamentoRecebido = true;
            this.aceiteDisponivel = false;
            callback();
          }
          else if (this.inscricao.EtapaInscricao === EEtapaInscricao.ProcessandoPagamento) {
            // Exibir mensagem de processamento do pagamento
            this.eventMessage = 'Estamos processando o pagamento e em breve teremos novidades!';
            this.processandoPagamento = true;
            this.aceiteDisponivel = false;
            callback();
          }
          else if (this.inscricao.EtapaInscricao === EEtapaInscricao.PendentePagamento) {
            if (this.inscricao.possuiContrato) {
              this.eventMessage = 'O próximo passo é realizar o pagamento da sua matrícula.';
            }
            else {
              if (!this.inscricao.possuiIsencaoInscricao) {
                this.eventMessage = 'O próximo passo é realizar o pagamento da taxa de inscrição.';
              }
              else {
                this.eventMessage = `Você está isento da taxa de inscrição no valor de R$ ${this.inscricao.Pagamento.Valor} para participar do Processo Seletivo de Medicina 2023/1. Por favor, clique em confirmar para avançar para a próxima etapa.`
                this.insentoInscricao = true;
              }
            }
            this.pagamentoPendente = true;
            this.aceiteDisponivel = false;
            this.service.ConsultarExtratoPagamento(this.inscricao.codigo)
              .subscribe((response3: Response) => {
                this.extratoPagamento = response3.result;
                callback();
              }, ((err: HttpErrorResponse) => {
              }));
          } else if (this.inscricao.EtapaInscricao === EEtapaInscricao.PendenteTaxaInscricao) {
            if (!this.inscricao.possuiIsencaoInscricao) {
              this.eventMessage = 'O próximo passo é realizar o pagamento da taxa de inscrição.';
              this.showPagamento = true;
            }
            else {
              this.eventMessage = 'Você está isento da taxa de inscrição no valor de R$ 80,00 para participar do Processo Seletivo de Medicina 2023/1. Por favor, clique em confirmar para avançar para a próxima etapa.'
              this.insentoInscricao = true;
            }


            if (possuiTaxaInscricaoPendente) {
              this.pagamentoPendente = true;
            }

            this.service.ConsultarExtratoPagamento(this.inscricao.codigo)
              .subscribe((response3: Response) => {
                this.extratoPagamento = response3.result;
                callback();
              }, ((err: HttpErrorResponse) => {
              }));
          } else if (this.inscricao.EtapaInscricao === EEtapaInscricao.PendenteFormaIngresso) {
            this.inscricao.EtapaInscricao = EEtapaInscricao.PagamentoRecebido;

            this.eventMessage = 'Recebemos seu pagamento, o próximo passo é atender os requisitos de entrada.';
            this.pagamentoRecebido = true;
            this.aceiteDisponivel = false;
            callback();
          } else if (this.stage == StageEnum.TaxaInscricao) {
            this.inscricao.EtapaInscricao = EEtapaInscricao.PagamentoRecebido;
            if (!this.inscricao.foiInsento) {
              this.eventMessage = 'Recebemos seu pagamento da taxa de inscrição.';
            }
            else {
              this.eventMessage = 'Pagamento da taxa de inscrição foi insenta.';
            }
            this.pagamentoRecebido = true;
            this.aceiteDisponivel = false;
            callback();
          }
          else {
            this.service.ConsultarExtratoCampanhas(
              0, this.inscricao.codigo).subscribe((response2: Response) => {
                this.campanhas = response2.result;
                this.loadingCampanha = false;
                this.eventMessage = this.inscricao.EtapaInscricao == EEtapaInscricao.ReAceiteDisponivel ?
                  'O contrato sofreu alterações. Por favor valide os valores e realize um novo aceite de contrato.'
                  :
                  'O próximo passo é realizar o aceite do seu contrato.';
                this.aceiteDisponivel = true;
                callback();
              }, (err: HttpErrorResponse) => {
              });
          }
        }
        else {
          //SE A API RETORNOU ALGUMA MSG PRÉDEFINIDA ENTÃO COLOCAR CASO CONTRARIO DEIXAR DEFAULT
          if (this.detalheInscricao.msgMatricula) {
            this.eventMessage = this.detalheInscricao.msgMatricula;
          } else {
            this.eventMessage = 'Contrato indisponível no momento. Por favor, tente novamente em instantes.';
          }
          this.aceiteIndisponivel = true;
          callback();
        }

      }, ((err: HttpErrorResponse) => {
        callback();
      }));
  }

  telaTaxaInscricao(): boolean {
    return this.stage == StageEnum.TaxaInscricao;
  }

  PossuiAceite() {
    this.showContrato = (this.aceiteDisponivel && (this.inscricao != null && (!this.inscricao.possuiContrato || this.inscricao.EtapaInscricao == EEtapaInscricao.ReAceiteDisponivel)));
    //this.showPagamento = (!this.aceiteDisponivel && (this.inscricao != null && this.inscricao.possuiContrato));
    this.showPagamento = (this.pagamentoPendente && this.inscricao.EtapaInscricao != EEtapaInscricao.ReAceiteDisponivel && !this.pagamentoRecebido && !this.matriculado);
    this.showInfoPagamento = ((this.pagamentoRecebido || this.processandoPagamento) && (this.inscricao.Pagamento !== null)) && !this.inscricao.possuiBolsa100;
  }

  ResetarIndicadores() {
    this.contratoGerado = false;
    this.aceiteIndisponivel = false;
    this.aceiteDisponivel = false;
    this.pagamentoPendente = false;
    this.pagamentoRecebido = false;
    this.processandoPagamento = false;
    this.matriculado = false;
  }

  visualizarContrato() {
    this.modal.open();
  }

  efetuarPagamento() {
    if (this.extratoPagamento) {
      this.modalpag.open(this.extratoPagamento.codLancamento);
    }
  }

  //ESSE MÉTODO IRÁ VERIFICAR PELO CODPSLAN SE A INSCRIÇÃO TEM UMA TENTATIVA DE PAGAMENTO E O MESMO AINDA ESTÁ EM PROCESSAMENTO
  private verificaTentativaPendente(codPsInscricao: number) {
    this.verificaTentativaPagamento = false;
    this.pagamentoService.ConsultarTentativaPagamento(codPsInscricao).subscribe(
      (response: Response) => {
        //SE O RETORNO DA API FOR TRUE SIGNIFICA QUE EXISTE UMA TENTATIVA DE PAGAMENTO E O MESMO ESTÁ PENDENTE DE PAGAMENTO
        if (response.statusCode == 200 && response.result != RetornoTelaPagamentoEnum.LiberarPagamento) {

          if (response.result == RetornoTelaPagamentoEnum.AguardarProcessamento) {
            this.eventMessage = 'Existe uma transação em processamento, por favor aguarde alguns minutos e retorne mais tarde';
            this.verificaTentativaPagamento = true
            this.processandoPagamento = true;
            this.etapaInscricao = EEtapaInscricao.ProcessandoPagamento;
            this.NgxSpinnerService.hide();
            this.loadingInscricao = false;
          }
          else if(response.result == RetornoTelaPagamentoEnum.PagamentoConfirmado) {
            window.location.reload();
          }
        }
        else {
          this.ConsultarInscricao(() => {
            this.PossuiAceite();
            this.NgxSpinnerService.hide();
            this.loadingInscricao = false;
            this.acesso = AcessoToscana.verificaAcessoToscana();
          });
        }
      },
      (error: Error) => {
        this.toasterService.error(error.message);
        console.error(error);
        this.NgxSpinnerService.hide();
        this.loadingInscricao = false;
      },
    )
  }

  emitirBoleto() {
    if (this.extratoPagamento) {
      this.modalBoleto.open(this.extratoPagamento.codLancamento);
    }
  }

  efetuarProcessoInsencao() {
    if (this.extratoPagamento) {
      this.NgxSpinnerService.show();
      this.pagamentoService.EmitirBoleto(this.extratoPagamento.codLancamento).subscribe(
        (response: Response) => {
          if (response.statusCode == 200) {
            this.StepsService.moveToNextStep();
          }
          else {
            this.toasterService.warning(response.message);
          }
        },
        (error: Error) => {
          this.toasterService.error(error.message)
        },
        () => {
          this.NgxSpinnerService.hide();
        })
    }
  }

  aceiteContratoConcluido(e: any) {
    this.NgxSpinnerService.show();

    this.ConsultarInscricao(() => {
      this.PossuiAceite();

      this.NgxSpinnerService.hide();

      this.NgxSpinnerService.hide('contrato');
    });
  }
  pagamentoConcluido(e: any) {
    this.NgxSpinnerService.show();

    this.ConsultarInscricao(() => {
      this.PossuiAceite();

      this.NgxSpinnerService.hide();

      this.NgxSpinnerService.hide('contrato');
    });
  }
}
