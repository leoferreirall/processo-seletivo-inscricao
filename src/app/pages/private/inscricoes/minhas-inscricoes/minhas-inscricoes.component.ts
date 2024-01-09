import { HttpErrorResponse } from '@angular/common/http';
import { IfStmt } from '@angular/compiler';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContratoService } from '@services/contrato.service';
import { InscricaoService } from '@services/inscricao.service';
import { ProvaOnlineService } from '@services/prova-online.service';
import { StepsService } from '@services/steps.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { EEtapaInscricao } from 'src/app/models/etapa-inscricao.enum';
import { Response } from 'src/app/models/response.model';
import { StageEnum } from 'src/app/models/stage.enum';
import { StatusEnum } from 'src/app/models/status.enum';
import { saveAs } from 'file-saver';
import { FormaIngresso } from 'src/app/models/Enums/FormaIngresso.enum';
import { AnaliseService } from '@services/analise.service';
import { ConvertBaseService } from 'src/app/Shared/Services/ConvertBase.service';
import { StatusAnalise } from 'src/app/models/Enums/StatusAnalise.enum';

declare var $: any;

@Component({
  selector: 'app-minhas-inscricoes',
  templateUrl: './minhas-inscricoes.component.html',
  styleUrls: ['./minhas-inscricoes.component.scss']

})
export class MinhasInscricoesComponent implements OnInit {
  title = 'Minhas Inscrições';
  inscricoes: Array<Inscricao> = [];
  private codPsReq: number;
  prova: Prova;
  statusProva: string;

  constructor(
    private service: InscricaoService,
    private avaliacaoService: ProvaOnlineService,
    private chRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private StepsService: StepsService,
    private router: Router,
    private contratoService: ContratoService,
    private toaster: ToastrService,
    private analiseService: AnaliseService,
    private convertBase: ConvertBaseService) {

  }
  ngOnInit() {
    this.StepsService.clearSteps();
    this.StepsService.setCurrentStepByStage(StageEnum.Cadastro);

    const codpessoa = Number(sessionStorage.getItem('cp'));
    this.spinner.show();


    this.statusProva = "";

    this.avaliacaoService.ConsultarUltimaAvaliacao(codpessoa).subscribe((response: Response) => {
      if (response.statusCode === 200) {
        if(response.result != null) {
          this.prova = new Prova(
            response.result.codPsReqAvaliacao,
            response.result.codColigada,
            response.result.codPsPessoa,
            response.result.codPsEnunciado,
            response.result.dataRealizacao,
            response.result.corretor,
            response.result.dataCorrecao,
            response.result.comentario,
            response.result.notaRedacao,
            response.result.status,
            response.result.redacao,
            response.result.statusCorrecao,
            response.result.titulo,
            response.result.codPsStatusReq,
            response.result.recCreatedBy,
            response.result.recCreatedOn,
            response.result.recModifiedBy,
            response.result.recModifiedOn,
            response.result.notaObjetiva,
            response.result.notaVideo
          );
        }
        if (this.prova?.codPsStatusReq == StatusEnum.Aprovado) {
          this.statusProva = "APROVADO";
        } else if (this.prova?.codPsStatusReq == StatusEnum.Reprovado) {
          this.statusProva = "REPROVADO";
        } else {
          this.statusProva = "PENDENTE";
        }
      }
    }, (err: HttpErrorResponse) => {
    }, () => {
      //this.spinner.hide();
    });

    this.service.ConsultarInscricoes(codpessoa).subscribe((response: Response) => {
      if (response.statusCode === 200) {
        response.result.map((item: any) => {
          let {
            codPsInscricao,
            codPsLead,
            campus,
            enderecoCampus,
            bairroCampus,
            cidadeCampus,
            ufCampus,
            cepCampus,
            curso,
            processoSeletivo,
            formaIngresso,
            periodoLetivo,
            turno,
            permiteEdicao,
            dataInscricao,
            etapaInscricao,
            statusEnem,
            statusAvaliacao,
            statusAnaliseHistorico,
            statusAnalise,
            statusDocumento,
            possuiBolsa100,
            processoSeletivoEncerrado,
            possuiContrato,
            idFormaIngresso,
            requisitos,
            statusMatricula,
            possuiIsencaoInscricao,
            idps,
            idAreaInteresse,
            codBolsa } = item;

          var statusAprovacao = 0;

          if (statusEnem != null) {
            statusAprovacao = statusEnem;
          }

          if (statusAprovacao != null) {
            if (this.prova != null) {
              if (this.prova?.codPsStatusReq == StatusEnum.Aprovado) {
                statusAprovacao = StatusEnum.Aprovado;
              } else if (this.prova?.codPsStatusReq == StatusEnum.Reprovado) {
                statusAprovacao = StatusEnum.Reprovado;
              } else if (this.prova?.codPsStatusReq == 15) {
                statusAprovacao = 0;
              }
            } else {
              statusAprovacao = 0;
            }
          }

          if (statusAnaliseHistorico != null) {
            statusAprovacao = statusAnaliseHistorico;
          }

          if (statusAnalise != null) {
            statusAprovacao = statusAnalise;
          }

          if (statusDocumento != null) {
            statusAprovacao = statusDocumento;
          }

          if (etapaInscricao === EEtapaInscricao.AceiteIndisponivel && !codPsInscricao)
            etapaInscricao = EEtapaInscricao.PreInscricao;

          this.inscricoes.push(
            new Inscricao(
              codPsInscricao,
              codPsLead,
              campus,
              enderecoCampus,
              bairroCampus,
              cidadeCampus,
              ufCampus,
              cepCampus,
              curso,
              processoSeletivo,
              periodoLetivo,
              formaIngresso,
              turno,
              permiteEdicao,
              dataInscricao,
              etapaInscricao,
              statusAprovacao,
              possuiBolsa100,
              processoSeletivoEncerrado,
              possuiContrato,
              idFormaIngresso,
              requisitos,
              statusAnalise,
              statusMatricula,
              possuiIsencaoInscricao,
              idps,
              idAreaInteresse,
              codBolsa
            ));
        });
      }
    }, (err: HttpErrorResponse) => {
    }, () => {
      this.spinner.hide();
    });

    // this.chRef.detectChanges();

    // const table: any = $('table');
    // //$.fn.dataTable.ext.classes.sPageButton = '';

    // table.DataTable(environment.tableOptions);
  }
  downloadContrato(codPsInscricao: number): void {
    this.spinner.show();
    this.contratoService.PegarContratoAceitoSalvo(codPsInscricao).subscribe(
      (resp: any) => {
        if (resp == null) {
          this.toaster.warning('Arquivo não encontrado!')
        } else {
          saveAs(resp)
        }
      },
      (error: Error) => {
        console.error(error.message);
        this.toaster.error("Algo deu errado!");
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  public InscricaoIfood(inscricao: any){
    return inscricao.codBolsa == '266'
  }

  public pegarCodPsRequisito(item: any) {
    this.StepsService.setRequisito(item, item.idFormaIngresso);
    this.codPsReq = this.StepsService.detalheInscricao.requisito.codPsReq;
  }

  onClickDownloadArquivo() {
    this.spinner.show();
    this.analiseService
      .downloadArquivoAnalise(this.codPsReq)
      .subscribe((response: Response) => {
        if (response.statusCode == 200) {
          if (response.result == null) {
            this.toaster.warning("Arquivo não encontrado")
          } else {
            const arquivo = response.result;
            const { base64,
              nome: fileName } = arquivo;

            let file = this.convertBase.convertBase64ToFile(base64, fileName);
            saveAs(file, fileName);
          }
        }
        else {
          this.toaster.warning(response.message);
        }
      },
        (error: Error) => {
          this.toaster.warning(error.message);
        },
        () => {
          this.spinner.hide();
        });
  }

  public VerificaAnaliseCurricular(codPsFormaIngresso: number, statusAnalise: number) {
    return (codPsFormaIngresso == FormaIngresso.PORTADOR_DE_DIPLOMA || codPsFormaIngresso == FormaIngresso.TRANSFERENCIA) && statusAnalise == StatusAnalise.APROVADO;
  }

  ngAfterViewInit(): void {
    var indexBackGroundDiv = document.getElementsByClassName('index-background') as HTMLCollectionOf<HTMLElement>;
    indexBackGroundDiv[0].style["background-color"] = "#FF8400";
  }

  onClickInscricao(inscricao: any) {
  }
  redirecionaUrl() {
    window.open("http://www.vemprafam.com.br/condicoes-especiais")
  }

  onClickDetalheInscricao(inscricao: Inscricao) {
    sessionStorage.setObject('uidi', inscricao.codPsInscricao);
    sessionStorage.setObject('uidl', inscricao.codPsLead);
    sessionStorage.setObject('n.i', false);
    if (this.verificaSeIn_Company(inscricao.idps, inscricao.idAreaInteresse)) {
      this.router.navigate([`in_company`])
    } else {
      this.router.navigate([`/`]);
    }
  }

  //ESSE MÉTODO VERIFICA SE A INSCRIÇÃO É IN_COMPANY SE SIM ENTÃO DIRECIONAR PARA A URL CORRETA
  private verificaSeIn_Company(idPs: number, idAreaInteresse: number) {
    return idPs == 307 && idAreaInteresse == 443
  }
}

class Inscricao {
  constructor(
    codPsInscricao: number,
    codPsLead: number,
    campus: string,
    enderecoCampus: string,
    bairroCampus: string,
    cidadeCampus: string,
    ufCampus: string,
    cepCampus: string,
    curso: string,
    processoSeletivo: string,
    periodoLetivo: string,
    formaIngresso: string,
    turno: string,
    permiteEdicao: boolean,
    dataInscricao: Date,
    etapaInscricao: EEtapaInscricao,
    statusAprovacao: StatusEnum,
    possuiBolsa100: boolean,
    processoSeletivoEncerrado: boolean,
    possuiContrato: boolean,
    idFormaIngresso: number,
    requisitos: any,
    statusAnalise: number,
    statusMatricula: string,
    possuiIsencaoInscricao: boolean,
    idps: number,
    idAreaInteresse: number,
    codBolsa: string) {

    this.codPsInscricao = codPsInscricao;
    this.codPsLead = codPsLead;
    this.campus = campus;
    this.enderecoCampus = enderecoCampus;
    this.bairroCampus = bairroCampus;
    this.cidadeCampus = cidadeCampus;
    this.ufCampus = ufCampus;
    this.cepCampus = cepCampus;
    this.curso = curso;
    this.formaIngresso = formaIngresso;
    this.processoSeletivo = processoSeletivo;
    this.periodoLetivo = periodoLetivo;
    this.turno = turno;
    this.permiteEdicao = permiteEdicao;
    this.dataInscricao = dataInscricao;
    this.etapaInscricao = etapaInscricao;
    this.statusAprovacao = statusAprovacao;
    this.possuiBolsa100 = possuiBolsa100;
    this.processoSeletivoEncerrado = processoSeletivoEncerrado;
    this.possuiContrato = possuiContrato;
    this.idFormaIngresso = idFormaIngresso;
    this.requisitos = requisitos;
    this.statusAnalise = statusAnalise;
    this.statusMatricula = statusMatricula ? String(statusMatricula).toUpperCase() : '';
    this.possuiIsencaoInscricao = possuiIsencaoInscricao;
    this.idps = idps;
    this.idAreaInteresse = idAreaInteresse;
    this.codBolsa = codBolsa;
  }
  codPsInscricao: number;
  codPsLead: number;
  campus: string;
  enderecoCampus: string;
  bairroCampus: string;
  cidadeCampus: string;
  ufCampus: string;
  cepCampus: string;
  curso: string;
  processoSeletivo: string;
  periodoLetivo: string;
  formaIngresso: string;
  turno: string;
  permiteEdicao: boolean;
  dataInscricao: Date;
  etapaInscricao: EEtapaInscricao;
  statusAprovacao: StatusEnum;
  possuiBolsa100: boolean;
  processoSeletivoEncerrado: boolean;
  possuiContrato: boolean;
  idFormaIngresso: number;
  requisitos: any;
  statusAnalise: number;
  statusMatricula: string;
  possuiIsencaoInscricao: boolean;
  idps: number;
  idAreaInteresse: number;
  codBolsa: string;

  descricaoSituacao(): string {
    if (this.etapaInscricao !== EEtapaInscricao.AceiteIndisponivel) {
      if (this.etapaInscricao === EEtapaInscricao.ProcessoSeletivoEncerrado) {
        return 'Processo seletivo encerrado';
      }
      else if (this.etapaInscricao === EEtapaInscricao.AguardandoClassificacaoChamada) {
        return 'Aguardando Classificação e Chamada';
      }
      else if (this.etapaInscricao === EEtapaInscricao.Matriculado) {
        return 'Matriculado';
      }
      else if (this.etapaInscricao === EEtapaInscricao.PagamentoRecebido) {
        if (this.possuiBolsa100) {
          return 'Processando Matrícula';
        }
        else {
          return 'Pagamento Recebido';
        }
      }
      else if (this.etapaInscricao === EEtapaInscricao.ProcessandoPagamento) {
        return 'Processando Pagamento';
      }
      else if (this.etapaInscricao === EEtapaInscricao.PendentePagamento || this.etapaInscricao === EEtapaInscricao.PendenteTaxaInscricao) {
        return 'Pendente Pagamento';
      }
      else if (this.etapaInscricao === EEtapaInscricao.PendenteFormaIngresso &&
        (this.statusAprovacao == StatusEnum.Pendente ||
          this.statusAprovacao == StatusEnum.DocumentacaoInvalida ||
          this.statusAprovacao == StatusEnum.Reprovado ||
          this.statusAprovacao == StatusEnum.AguardandoAceiteAnalise ||
          this.statusAprovacao == StatusEnum.DocumentacaoPendenteEntrega
        )) {
        if (this.possuiBolsa100) {
          return 'Aguardando Vestibular';
        }
        else {
          return 'Pendente Informações Candidato';
        }
      }
      else if (this.etapaInscricao === EEtapaInscricao.PendenteFormaIngresso) {
        return 'Em Análise';
      }
      else if (this.etapaInscricao === EEtapaInscricao.PreInscricao) {
        return 'Pré Inscrição';
      }
      else {
        return 'Pendente Aceite Contrato';
      }
    }
    else {
      return 'Aceite Indisponível';
    }
  }
}

class Prova {
  constructor(
    codPsReqAvaliacao: number,
    codColigada: number,
    codPsPessoa: number,
    codPsEnunciado: number,
    dataRealizacao: Date,
    corretor: string,
    dataCorrecao: Date,
    comentario: string,
    notaRedacao: number,
    status: number,
    redacao: string,
    statusCorrecao: number,
    titulo: string,
    codPsStatusReq: number,
    recCreatedBy: string,
    recCreatedOn: Date,
    recModifiedBy: string,
    recModifiedOn: Date,
    notaObjetiva: number,
    notaVideo: number
  ){
    this.codPsReqAvaliacao = codPsReqAvaliacao;
    this.codColigada = codColigada;
    this.codPsPessoa = codPsPessoa;
    this.codPsEnunciado = codPsEnunciado;
    this.dataRealizacao = dataRealizacao;
    this.corretor = corretor;
    this.dataCorrecao = dataCorrecao;
    this.comentario = comentario;
    this.notaRedacao = notaRedacao;
    this.status = status;
    this.redacao = redacao;
    this.statusCorrecao = statusCorrecao;
    this.titulo = titulo;
    this.codPsStatusReq = codPsStatusReq;
    this.recCreatedBy = recCreatedBy;
    this.recCreatedOn = recCreatedOn;
    this.recModifiedBy = recModifiedBy;
    this.recModifiedOn = recModifiedOn;
    this.notaObjetiva = notaObjetiva;
    this.notaVideo = notaVideo;

  }
  codPsReqAvaliacao: number;
  codColigada: number;
  codPsPessoa: number;
  codPsEnunciado: number;
  dataRealizacao: Date;
  corretor: string;
  dataCorrecao: Date;
  comentario: string;
  notaRedacao: number;
  status: number;
  redacao: string;
  statusCorrecao: number;
  titulo: string;
  codPsStatusReq: number;
  recCreatedBy: string;
  recCreatedOn: Date;
  recModifiedBy: string;
  recModifiedOn: Date;
  notaObjetiva: number;
  notaVideo: number;
}
