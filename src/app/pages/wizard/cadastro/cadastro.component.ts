import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitterService } from '@services/event-emitter.service';
import { InscricaoService } from '@services/inscricao.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Acoes } from 'src/app/models/acoes.enum';
import { ListItem } from 'src/app/models/list-item.model';
import { StepsService } from '@services/steps.service';
import { DadosPessoaisComponent } from 'src/app/components/dados-pessoais/dados-pessoais.component';
import { TermosCondicoesComponent } from 'src/app/components/termos-condicoes/termos-condicoes.component';
import { NgForm } from '@angular/forms';
import { Filtro } from 'src/app/models/filtro.model';
import { AuthService } from '@services/auth/auth.service';
import { DropDownListComponent } from 'src/app/components/drop-down-list/drop-down-list.component';
import { cpf as validatorCPF } from 'cpf-cnpj-validator';
import Swal from 'sweetalert2';
import { StageEnum } from 'src/app/models/stage.enum';
import { Regex } from 'src/app/Helpers/Regex';
import { InscricaoMatriculaService } from 'src/app/Shared/Services/InscricaoMatricula.service';

declare var App: any;

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {
  @ViewChild(DadosPessoaisComponent) dadosPessoais: DadosPessoaisComponent;
  @ViewChild(TermosCondicoesComponent) termosCondicoes: TermosCondicoesComponent;
  @ViewChild('form') form: NgForm;

  @ViewChild('procsel') procsel: DropDownListComponent;
  @ViewChild('calendario') calendario: DropDownListComponent;
  @ViewChild('curso') curso: DropDownListComponent;
  @ViewChild('turno') turno: DropDownListComponent;
  @ViewChild('formaingresso') formaingresso: DropDownListComponent;
  @ViewChild('estado') estado: DropDownListComponent;
  @ViewChild('cidade') cidade: DropDownListComponent;
  @ViewChild('polo') polo: DropDownListComponent;


  @Input('id') id: number;

  permiteEdicao: boolean = true;

  loggedIn: boolean = false;

  inscricao: any = {};

  lead: any = null;
  showCalendario: boolean = false;

  edit: boolean = false;


  processosseletivos: Array<ListItem> = [];
  calendarios: Array<ListItem> = [];
  unidades: Array<ListItem> = [];
  cursos: Array<ListItem> = [];
  turnos: Array<ListItem> = [];
  formasingressos: Array<ListItem> = [];
  polos: Array<ListItem> = [];
  estados: Array<ListItem> = [];
  cidades: Array<ListItem> = [];
  parcelas: any[] = [];
  convenios: any[] = [];

  processoselecionado: any = null;
  calendarioselecionado: any = null;
  unidadeselecionada: any = null;
  cursoselecionado: any = null;
  turnoselecionado: any = null;
  formaingressoselecionada: any = null;
  estadopolo: string = null;
  cidadepolo: string = null;
  convenio: string = null;

  estadoselecionado: string = null;
  cidadeselecionada: string = null;
  poloselecionado: any = null;
  enderecopolo: string;

  showTurno: boolean;
  showFormaIngresso: boolean;
  showPeriodoIngresso: boolean;
  showCurso: boolean;

  private subinicial: any;
  private subprocsel: any;
  private subcalendario: any;
  private subcurso: any;
  private subturno: any;
  private subforming: any;
  private subEstado: any;
  private subCidade: any;

  ps: string;
  codBolsa: string;
  uidl: number = null;
  uidi: number = null;
  cp: number = null;
  novainscricao: boolean = false;
  codPerLet: string;

  termosaceitos: boolean = false;

  convenioParceiro: string;
  fi: string = null;
  ignoraFimInscricao: boolean;

  //ATRIBUTOS PARA BUSCAR OS PROCESSO SELETIVO DO IN COMPANY
  private idPs: number;
  private idAreaInteresse: number;

  constructor(
    private StepsService: StepsService,
    private service: InscricaoService,
    private authService: AuthService,
    private toastr: ToastrService,
    private NgxSpinnerService: NgxSpinnerService,
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    private Authservice: AuthService,
    private InscricaoService: InscricaoMatriculaService
  ) { }

  ngOnInit(): void {

    var v = sessionStorage.getObject('v');

    if (!v) {
      setTimeout(() => this.StepsService.clearSteps());
    }

    this.loggedIn = this.Authservice.loggedIn() ? true : false;
    this.uidl = sessionStorage.getObject('uidl');
    this.uidi = sessionStorage.getObject('uidi');
    this.cp = sessionStorage.getObject('cp');

    //PEGANDO OS ATRIBUTOS DA URL
    this.ps = this.ActivatedRoute.snapshot.data["ps"] || null;

    this.fi = this.ActivatedRoute.snapshot.data["fi"] || null;

    this.ignoraFimInscricao = this.ActivatedRoute.snapshot.data["ignoraFimInscricao"] || false;

    this.convenioParceiro = this.ActivatedRoute.snapshot.data["convenioParceiro"] || null;

    this.idPs = this.ActivatedRoute.snapshot.data["idPs"] || null;

    this.idAreaInteresse = this.ActivatedRoute.snapshot.data["idAreaInteresse"] || null;

    this.codBolsa = this.ActivatedRoute.snapshot.queryParamMap.get('bolsa') || null;

    this.codPerLet = this.ActivatedRoute.snapshot.queryParamMap.get('semestre') || null;

    this.novainscricao = !this.uidl && !this.uidi;

    this.AddTagsGTM();

    this.subinicial = EventEmitterService.get(Acoes.Inicial).subscribe(() => this.CarregarProcessoSeletivos());
    this.subprocsel = EventEmitterService.get(Acoes.ProcessoSeletivo).subscribe(() => this.CarregarCalendarios());
    this.subcalendario = EventEmitterService.get(Acoes.Calendario).subscribe(() => this.CarregarCursos());
    this.subcurso = EventEmitterService.get(Acoes.Curso).subscribe(() => this.CarregarTurnos());
    this.subturno = EventEmitterService.get(Acoes.Turno).subscribe(() => this.CarregarFormasIngressos());
    this.subforming = EventEmitterService.get(Acoes.FormaIngresso).subscribe(() => this.CarregarEstados());
    this.subEstado = EventEmitterService.get(Acoes.EstadoPolo).subscribe(() => this.CarregarCidades());
    this.subCidade = EventEmitterService.get(Acoes.CidadePolo).subscribe(() => this.CarregarPolos());

    if (this.authService.loggedIn()) {
      this.NgxSpinnerService.show('edit');
      if (this.uidi && this.cp) {
        this.service.ConsultarDetalheInscricao(this.uidi, this.cp)
          .subscribe((response: Response) => {
            if (response.statusCode === 200) {
              const {
                permiteEdicao
              } = response.result;

              this.permiteEdicao = permiteEdicao;

              if (!v) {
                this.StepsService.setSequenciaSteps(response.result);

                this.StepsService.validNextStep(response.result);

                this.NgxSpinnerService.hide('edit');
              }
              else {
                this.carregarInformacoes();
              }
            } else if (response.statusCode === 404) {
              this.carregarInformacoes();
            }
            else {
              this.NgxSpinnerService.hide('edit');
            }
          });
      }
      else if (this.uidl && !v) {
        setTimeout(() => this.StepsService.setCurrentStepByStage(StageEnum.DadosComplementares));
      }
      else if (this.novainscricao || this.uidl) {
        this.carregarInformacoes();
      } else {
        this.NgxSpinnerService.hide('edit');
      }
    } else {
      this.CarregarProcessoSeletivos();
    }
  }



  ngOnDestroy() {
    this.subinicial.unsubscribe();
    this.subprocsel.unsubscribe();
    this.subcalendario.unsubscribe();
    this.subcurso.unsubscribe();
    this.subturno.unsubscribe();
    this.subforming.unsubscribe();
    this.subEstado.unsubscribe();
    this.subCidade.unsubscribe();
  }



  aceitartermos(e: any) {
    this.termosaceitos = e;
  }

  carregarInformacoes() {
    var testeCreate = sessionStorage.getItem('createInscricao');
    this.service.ConsultarInfoInscricao({
      codpslead: this.uidl,
      codpsinscricao: this.uidi,
      CreateInscricao: testeCreate
    }).subscribe({
      next: (response: Response) => {
        //REMOVENDO O PAREMETRO QUE INDICA PARA O SISTEMA QUE ESTA EM MODE DE CRIAÇÃO
        sessionStorage.removeItem('createInscricao');
        if (response.statusCode === 200) {
          this.lead = response.result;
          //SE O LEAD FOR DIFERENTE DE NULL SIGNIFICA QUE O USUARIO JÁ TEM UM LEAD E PASSAR PARA PRÓXIMA TELA (DADOS COMPLEMENTARES)
          if (this.lead.codPSLead > 0 && sessionStorage.getItem('cp') === 'null') {
            //SALVANDO O CODPSLEAD NO SESSIONSTOREGE
            sessionStorage.setObject('uidl', this.lead.codPSLead);
            //SALVANDO O CODPSUSUARIO NO SESSIONSTOREGE
            sessionStorage.setObject('cp', this.lead.codPsUsuario);
            sessionStorage.removeItem('v');
            this.StepsService.moveToNextStep();
          }
          else {
            this.NgxSpinnerService.show('edit');
            //RETIRANDO TUDO QUE NÃO É NUMERO DO PARAMETRO CELULAR
            response.result.celular = Regex.deixarApenasNumeros(response.result.celular);
            response.result.telefone = Regex.deixarApenasNumeros(response.result.telefone);
            const {
              nome,
              telefone,
              celular,
              email,
              cpf,
              aceiteNotificacoesPromoEmail,
              aceiteNotificacoesPromoFone,
              aceitePoliticaDeUsoDeDados,
              aceitePoliticaDePrivacidade
            } = response.result;

            this.dadosPessoais.setModel({
              nome,
              telefone,
              celular,
              email,
              confirmacaoemail: email,
              cpf
            });
            this.termosCondicoes.setModel({
              aceitenotificacoes: (aceiteNotificacoesPromoEmail || aceiteNotificacoesPromoFone),
              aceitepoliticas: (aceitePoliticaDeUsoDeDados || aceitePoliticaDePrivacidade)
            });
            this.aceitartermos(aceitePoliticaDePrivacidade);
          }
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      },
      complete: () => {
        this.CarregarProcessoSeletivos();
      }
    });
  }

  onSubmit(substituir: boolean = false, matriculaConfirmada: boolean = false) {
    const { nome, telefone, celular, email, confirmacaoemail, cpf } = this.dadosPessoais.getModel();
    const { aceitenotificacoes, aceitepoliticas } = this.termosCondicoes.getModel();

    const { categoriaPs, codTipoCurso, codFilial, idCategoriaPs } = this.processoselecionado;
    const { idPerLet, calendario } = this.calendarioselecionado;
    const { codCurso, codTipoHabilitacao } = this.cursoselecionado;
    const { codTurno, idAreaInteresse } = this.turnoselecionado;
    const { idPs, idFormaInscricao } = this.formaingressoselecionada;
    const codBolsa = this.convenio;
    const codpessoa = Number(sessionStorage.getItem('codPsPessoa'));
    const codPsLead = sessionStorage.getObject('uidl') != null ? Number(sessionStorage.getObject('uidl')) : null;

    if (email != confirmacaoemail) {
      this.toastr.warning('Favor verificar o e-mail');
      return;
    }

    if (!validatorCPF.isValid(cpf)) {
      this.toastr.warning('Favor verificar o CPF');
      return;
    }

    // if (sessionStorage.getItem("emailAlert") == 'true') {

    //   Swal.fire({
    //     title: '<strong style="color:#ff5c00">Digite um e-mail valido</strong>',
    //     text: 'Utilizaremos este e-mail para contato ',
    //     icon: 'info',
    //     showCancelButton: false,
    //     confirmButtonText: 'Continuar',
    //     confirmButtonColor: '#ff5c00'
    //   });

    //   return;
    // }

    this.lead = {
      codPsLead: codPsLead,
      nome: nome.toUpperCase(),
      telefone,
      celular,
      email,
      cpf,
      aceitenotificacaopromoemail: aceitenotificacoes,
      aceitenotificacaopromofone: aceitenotificacoes,
      aceitepoliticadados: aceitepoliticas,
      aceitepoliticaprivacidade: aceitepoliticas,
      latitude: 0,
      longitude: 0,
      utmsource: 'SITE',
      utmcampaign: '',
      preferencia: {
        codFilial,
        codtipocurso: codTipoCurso,
        idcategoriaps: idCategoriaPs,
        idareainteresse: idAreaInteresse,
        idps: idPs,
        idperlet: idPerLet,
        idformainscricao: idFormaInscricao,
        codperiodo: 1,
        codbolsa: codBolsa,
        codcurso: codCurso,
        codturno: codTurno,
        convenioParceiro: this.convenioParceiro
      },
      substituir: substituir,
      MatriculaConfirmada: matriculaConfirmada
    };

    if (this.poloselecionado != null) {
      const { codigo, ufcampus, cidadecampus } = this.poloselecionado;
      this.lead.preferencia.codcampus = codigo;
      this.lead.preferencia.ufcampus = ufcampus;
      this.lead.preferencia.cidadecampus = cidadecampus;
    }

    if (!this.validarTelefone(this.lead.celular)) {
      return;
    }

    if (this.lead.telefone && !this.validarTelefone(this.lead.telefone)) {
      return;
    }

    App.tagFacebookCadastro();

    this.NgxSpinnerService.show();

    this.service.CriarInscricao(this.lead, this.uidi == null ? 0 : this.uidi).subscribe((response: Response) => {

      this.NgxSpinnerService.hide();

      if (response.statusCode === 200) {

        //SE A API ENVIOU QUE EXISTE MATRICULA ENTÃO EFETUAR UMA OUTRA PERGUNTA, E SE ACEITO, LIBERAR O CADASTRO DA MATRICULA
        if (response.result.VerificacaoInscricao?.ExisteMatricula) {
          this.NgxSpinnerService.hide();

          Swal.fire(this.InscricaoService.MsgConfirmarMatricula(response.result)).then((result) => {
            if (result.isConfirmed) {
              this.lead.matriculaConfirmada = true;
              this.onSubmit(false, true);
            }
          });
        }
        //SE A INSCRIÇÃO PUDER SER SUBSTITUIDA ENTÃO CHAMAR MODAL DE QUESTIONAMENTO
        else if (response.result.substituir) {

          this.NgxSpinnerService.hide();

          Swal.fire(this.InscricaoService.MsgCancelarInscricao(response.result)).then((result) => {
            if (result.isConfirmed) {
              this.lead.substituir = true;
              this.onSubmit(true);
            }
          });
        }
        else {
          this.form.resetForm();

          const { codPsLead } = response.result;
          sessionStorage.setObject('uidl', codPsLead);
          // sessionStorage.removeItem('uidi');
          sessionStorage.removeItem('v');

          if (!this.authService.loggedIn()) {

            if (response.result.autenticar) {
              Swal.fire({
                title: '<strong style="color:#ff5c00">Você já possui cadastro, favor realizar o login</strong>',
                text: 'Use seu CPF para entrar',
                icon: 'info',
                showCancelButton: false,
                confirmButtonText: 'Continuar',
                confirmButtonColor: '#ff5c00'
              }).then((result) => {
                this.router.navigate(['/painel-do-candidato', response.result]);
              });
            } else {
              sessionStorage.setObject('user', response.result);

              this.StepsService.moveToNextStep();
            }
          } else {
            this.StepsService.moveToNextStep();
          }
        }
      }
      else if (response.statusCode === 400) {
        this.toastr.warning(response.message);
      }
    }, (err: HttpErrorResponse) => {
      this.NgxSpinnerService.hide();
    });
  }

  ///ESTE MÉTODO IRÁ RECEBER DA API UM OBJ NA QUAL SERÁ VERIFICADO SE O ALUNO ESTÁ COM ALGUMA INADIPLENCIA, JUDICIAL OU ALGUMA MATRICULA E ENVIAR A MSG DE ACORDO
  retornaMsg(obj: any): void {

  }

  validarTelefone(telefone: any): boolean {
    var ddd = telefone.substring(0, 2);
    var numero = telefone.substring(2);

    if (ddd < 11 || ddd > 99) {
      this.toastr.warning('DDD inválido');
      return false;
    } else if (numero == '00000000' ||
      numero == '11111111' ||
      numero == '22222222' ||
      numero == '33333333' ||
      numero == '44444444' ||
      numero == '55555555' ||
      numero == '66666666' ||
      numero == '77777777' ||
      numero == '88888888' ||
      numero == '99999999') {
      this.toastr.warning('Telefone inválido');
      return false;
    }
    else
      return true;
  }

  onChangePsel(selecionado: any) {
    this.ResetarCombos(Acoes.ProcessoSeletivo);

    if (selecionado) {
      this.processoselecionado = selecionado;
      EventEmitterService.get(Acoes.ProcessoSeletivo).emit();
    }
  }
  onChangeCalendario(selecionado: any) {
    this.ResetarCombos(Acoes.Calendario);

    if (selecionado) {
      this.calendarioselecionado = selecionado;
      EventEmitterService.get(Acoes.Calendario).emit();
    }
  }
  onChangeUnidade(selecionado: any) {
    this.ResetarCombos(Acoes.Unidade);

    if (selecionado) {
      this.unidadeselecionada = selecionado;
      EventEmitterService.get(Acoes.Unidade).emit();
    }
  }
  onChangeCurso(selecionado: any) {
    this.ResetarCombos(Acoes.Curso);

    if (selecionado) {
      this.cursoselecionado = selecionado;
      EventEmitterService.get(Acoes.Curso).emit();
    }
  }
  onChangeTurno(selecionado: any) {
    this.ResetarCombos(Acoes.Turno);

    if (selecionado) {
      this.turnoselecionado = selecionado;
      EventEmitterService.get(Acoes.Turno).emit();
    }
  }
  onChangeEstadoPolo(selecionado: any) {
    this.ResetarCombos(Acoes.EstadoPolo);

    if (selecionado) {
      EventEmitterService.get(Acoes.EstadoPolo).emit();
    }
  }
  onChangeCidadePolo(selecionado: any) {
    this.ResetarCombos(Acoes.CidadePolo);

    if (selecionado) {
      EventEmitterService.get(Acoes.CidadePolo).emit();
    }
  }

  onChangeFormaIngresso(selecionado: any) {
    this.ResetarCombos(Acoes.FormaIngresso);

    if (selecionado) {
      this.formaingressoselecionada = selecionado;
      this.NgxSpinnerService.hide('edit');
      EventEmitterService.get(Acoes.FormaIngresso).emit();
    }
  }
  onChangeConvenio(selecionado: any) {
    this.ResetarCombos(Acoes.Convenio);

    EventEmitterService.get(Acoes.Convenio).emit();
  }

  onChangeEstado(selecionado: any) {
    this.ResetarCombos(Acoes.EstadoPolo);
    if (selecionado) {
      this.estadoselecionado = selecionado;
      this.CarregarCidades();
    }
  }
  onChangeCidade(selecionado: any) {
    this.ResetarCombos(Acoes.CidadePolo);
    if (selecionado) {
      this.cidadeselecionada = selecionado;
      this.CarregarPolos();
    }
  }

  onChangePolo(selecionado: any) {
    this.ResetarCombos(Acoes.Polo);

    if (selecionado) {
      this.poloselecionado = selecionado;
      this.poloselecionado.ufcampus = this.estadoselecionado;
      this.poloselecionado.cidadecampus = this.cidadeselecionada;
      this.enderecopolo = `${this.poloselecionado.endereco} - ${this.poloselecionado.bairro} - ${this.poloselecionado.cidade} - ${this.poloselecionado.ufcampus}`;
    }
  }

  private popularProcessosSeletivos(response: any) {
    this.ExibirSelecione('processosseletivos', 'procsel');
    this.processosseletivos.push(...response.result.map((item: any) => {
      return {
        id: item.categoriaPs,
        texto: `${item.categoriaUnidade}`,
        valor: item,
        selected: false,
        disabled: false
      };
    }));

    var codTipoCurso = null;
    var idCategoriaPs = null;

    if (this.lead && this.lead.preferencia) {
      codTipoCurso = this.lead.preferencia.codTipoCurso;
      idCategoriaPs = this.lead.preferencia.idCategoriaPS;
    } else if (response.result.length == 1) {
      codTipoCurso = response.result[0].codTipoCurso;
      idCategoriaPs = response.result[0].idCategoriaPs;
    }

    // EDICAO
    if (codTipoCurso && idCategoriaPs) {
      var processoselecionado = response.result.find((x: any) => x.codTipoCurso === codTipoCurso && x.idCategoriaPs === idCategoriaPs);

      if (processoselecionado) {
        this.processoselecionado = processoselecionado;
        this.procsel.setSelected(processoselecionado);

        EventEmitterService.get(Acoes.ProcessoSeletivo).emit();
      }
    } else {
      this.NgxSpinnerService.hide('edit');
    }
  }

  private processosVariados() {
    this.service.ConsultarProcessosSeletivosUnidades(this.codPerLet, this.ps, this.fi, this.ignoraFimInscricao)
      .subscribe({
        next: (response: Response) => {
          if (response.statusCode === 200 && response.result !== null && response.result.length > 0) {
            this.popularProcessosSeletivos(response);
          } else {
            this.NgxSpinnerService.hide('edit');
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error(err)
        },
        complete: () => {
          this.NgxSpinnerService.hide('edit');
        }
      });
  }

  private processosInCompany() {
    this.service.ConsultarProcessoSeletivoInCompany(this.idPs, this.idAreaInteresse)
      .subscribe({
        next: (response: Response) => {
          if (response.statusCode === 200 && response.result !== null && response.result.length > 0) {
            this.popularProcessosSeletivos(response);
          } else {
            this.NgxSpinnerService.hide('edit');
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error(err)
        },
        complete: () => {
          this.NgxSpinnerService.hide('edit');
        }
      });
  }

  private CarregarProcessoSeletivos(): any {
    this.ExibirCarregando('processosseletivos', 'procsel');
    if (this.idPs && this.idAreaInteresse) {
      this.processosInCompany();
    } else {
      this.processosVariados();
    }
  }
  private CarregarCalendarios(): any {
    this.ExibirCarregando('calendarios', 'calendario');
    this.service.ConsultarCalendarios(this.MontarFiltro())
      .subscribe((response: Response) => {
        if (response.statusCode === 200 && response.result !== null && response.result.length > 0) {
          this.ExibirSelecione('calendarios', 'calendario');
          this.calendarios.push(...response.result.map((item: any) => {
            return {
              id: item.idPerlet,
              texto: item.periodoLetivo,
              valor: item,
              selected: false,
              disabled: false
            };
          }));

          var idPerlet = null;

          if (this.lead && this.lead.preferencia) {
            idPerlet = this.lead.preferencia.idPerlet;
          } else if (response.result.length == 1) {
            idPerlet = response.result[0].idPerLet;
          }

          if (response.result.length > 0) {
            this.showPeriodoIngresso = true;
          }

          // EDICAO
          if (idPerlet) {
            var calendarioselecionado = response.result.find((x: any) => x.idPerLet === idPerlet);

            if (calendarioselecionado) {
              this.calendarioselecionado = calendarioselecionado;
              this.calendario.setSelected(calendarioselecionado);
              EventEmitterService.get(Acoes.Calendario).emit();
            }
          }
        } else {
          this.NgxSpinnerService.hide('edit');
        }
      }, (err: HttpErrorResponse) => {
        this.NgxSpinnerService.hide('edit');
      });
  }

  private CarregarCursos(): any {
    this.ExibirCarregando('cursos', 'curso');
    this.service.ConsultarCursosTipoHabilitacao(
      this.MontarFiltro())
      .subscribe((response: Response) => {
        if (response.statusCode === 200 && response.result !== null && response.result.length > 0) {
          this.ExibirSelecione('cursos', 'curso');
          this.cursos.push(...response.result.map((item) => {
            return {
              id:  `${item.codCurso}-${item.codTipoHabilitacao}`,
              texto: item.cursoTipo,
              valor: item,
              selected: false,
              disabled: false
            };
          }));

          var codCurso = null;

          if (this.lead && this.lead.preferencia) {
            codCurso = `${this.lead.preferencia.codCurso}-${this.lead.preferencia.codPsHabilitacao}`;
          } else if (response.result.length == 1) {
            codCurso = response.result[0].codCurso;
          }

          if (response.result.length > 0) {
            this.showCurso = true;
          }

          if (codCurso) {
            var cursoselecionado = response.result.find((x: any) => `${x.codCurso}-${x.codTipoHabilitacao}` === codCurso);
            if (cursoselecionado) {
              this.cursoselecionado = cursoselecionado;
              this.curso.setSelected(cursoselecionado);
              EventEmitterService.get(Acoes.Curso).emit();
            }
          } else {
            this.NgxSpinnerService.hide('edit');
          }
        } else {
          this.NgxSpinnerService.hide('edit');
        }
      }, (err: HttpErrorResponse) => {
        this.NgxSpinnerService.hide('edit');
      });
  }
  private CarregarTurnos(): any {
    this.ExibirCarregando('turnos', 'turno');
    this.service.ConsultarTurnos(
      this.MontarFiltro())
      .subscribe((response: Response) => {
        if (response.statusCode === 200 && response.result !== null && response.result.length > 0) {
          this.ExibirSelecione('turnos', 'turno');
          this.turnos.push(...response.result.map((item) => {
            return {
              id: item.codTurno,
              texto: item.nome,
              valor: item,
              selected: false,
              disabled: false
            };
          }));

          var codTurno = null;

          if (this.lead && this.lead.preferencia) {
            codTurno = this.lead.preferencia.codTurno;
          } else if (response.result.length == 1) {
            codTurno = response.result[0].codTurno;
          }
          // VERIFICANDO SE O PROCESSO SELETIVO É PRESENCIAL, SE SIM ENTÃO MOSTRAR O COMBO TURNO MESMO TENDO APENAS UMA OPÇÃO
          var processoSeletivo = String(this.processoselecionado.categoriaPs).toLowerCase().indexOf('presencial') != -1;

          if (response.result.length > 1 || (processoSeletivo && response.result.length > 0)) {
            this.showTurno = true;
          }

          if (codTurno) {
            var turnoselecionado = response.result.find((x: any) => x.codTurno === codTurno);
            if (turnoselecionado) {
              this.turnoselecionado = turnoselecionado;
              this.turno.setSelected(turnoselecionado);
              EventEmitterService.get(Acoes.Turno).emit();
            }
          }
        } else {
          this.NgxSpinnerService.hide('edit');
        }
      }, (err: HttpErrorResponse) => {
        this.NgxSpinnerService.hide('edit');
      });
  }

  private CarregarFormasIngressos(): any {
    this.ExibirCarregando('formasingressos', 'formaingresso');
    this.service.ConsultarFormasIngresso(
      this.MontarFiltro())
      .subscribe((response: Response) => {
        if (response.statusCode === 200 && response.result !== null && response.result.length > 0) {
          this.ExibirSelecione('formasingressos', 'formaingresso');
          this.formasingressos.push(...response.result.map((item) => {
            return {
              id: item.idPs,
              texto: item.nome,
              valor: item,
              selected: false,
              disabled: false
            };
          }));

          var idFormaInscricao = null;
          var idps = null;

          if (this.lead && this.lead.preferencia) { // edit
            idFormaInscricao = this.lead.preferencia.idFormaInscricao;
            idps = this.lead.preferencia.idps;
          } else if (response.result.length == 1) {
            idFormaInscricao = response.result[0].idFormaInscricao;
            idps = response.result[0].idPs;
          }

          if (response.result.length > 0) {
            this.showFormaIngresso = true;
          }

          if (idFormaInscricao && idps) {
            this.formaingressoselecionada = response.result.find((x: any) => x.idFormaInscricao === idFormaInscricao && x.idPs === idps);
          } else if (this.fi) {
            this.formaingressoselecionada = response.result.find((x: any) => x.nome === this.fi);
          }

          if (this.formaingressoselecionada) {
            this.formaingresso.setSelected(this.formaingressoselecionada);

            EventEmitterService.get(Acoes.FormaIngresso).emit();
          }

        } else {
          this.NgxSpinnerService.hide('edit');
        }
      }, (err: HttpErrorResponse) => {
        this.NgxSpinnerService.hide('edit');
      });
  }

  CarregarEstados() {
    this.ExibirCarregando('estados', 'estado');
    this.service.ConsultarEstadosPolo(this.MontarFiltro())
      .subscribe((response: Response) => {
        if (response.statusCode === 200 && response.result !== null && response.result.length > 0) {
          this.estados = [];
          this.ExibirSelecione('estados', 'estado');
          this.estados.push(...response.result.map((item) => {
            return {
              id: item.uf,
              texto: item.nome,
              valor: item.uf,
              selected: false,
              disabled: false
            };
          }));

          var ufCampus;

          if (this.lead && this.lead.preferencia) {
            ufCampus = this.lead.preferencia.ufCampus;
          } else if (response.result.length == 1) {
            ufCampus = response.result[0].uf;
          }

          if (ufCampus) {
            var estadoselecionado = response.result.find((x: any) => x.uf === ufCampus);
            if (estadoselecionado) {
              this.estadoselecionado = estadoselecionado.uf;

              if (this.estado) {
                this.estado.setSelected(estadoselecionado.uf);
              }

              EventEmitterService.get(Acoes.EstadoPolo).emit();
            }
          }
        } else {
          this.NgxSpinnerService.hide('edit');
        }
      }, (err: HttpErrorResponse) => {
        this.NgxSpinnerService.hide('edit');
      });
  }

  CarregarCidades() {
    this.ExibirCarregando('cidades', 'cidade');
    this.service.ConsultarCidadesPolo(
      this.estadoselecionado,
      this.MontarFiltro())
      .subscribe((response: Response) => {
        if (response.statusCode === 200 && response.result !== null && response.result.length > 0) {
          this.cidades = [];
          this.ExibirSelecione('cidades', 'cidade');
          this.cidades.push(...response.result.map((item) => {
            return {
              id: item.codMunicipio,
              texto: item.nome,
              valor: item.codMunicipio,
              selected: false,
              disabled: false
            };
          }));

          var cidadeCampus;

          if (this.lead && this.lead.preferencia) {
            cidadeCampus = this.lead.preferencia.cidadeCampus;
          } else if (response.result.length == 1) {
            cidadeCampus = response.result[0].codMunicipio;
          }

          if (cidadeCampus) {
            var cidadeselecionada = response.result.find((x: any) => x.codMunicipio === cidadeCampus);

            if (cidadeselecionada) {
              this.cidadeselecionada = cidadeselecionada.codMunicipio;

              if (this.cidade) {
                this.cidade.setSelected(cidadeselecionada.codMunicipio);
              }

              EventEmitterService.get(Acoes.CidadePolo).emit();
            }
          }
        } else {
          this.NgxSpinnerService.hide('edit');
        }
      }, (err: HttpErrorResponse) => {
        this.NgxSpinnerService.hide('edit');
      });
  }

  CarregarPolos() {
    this.ExibirCarregando('polos', 'polo');
    this.service.ConsultarPolos(
      this.estadoselecionado,
      this.cidadeselecionada,
      this.MontarFiltro())
      .subscribe((response: Response) => {
        this.NgxSpinnerService.hide('edit');

        if (response.statusCode === 200 && response.result !== null && response.result.length > 0) {
          this.polos = [];
          this.ExibirSelecione('polos', 'polo');
          this.polos.push(...response.result.map((item) => {
            return {
              id: item.codigo,
              texto: item.nome,
              valor: item,
              selected: false,
              disabled: false
            };
          }));

          var codCampus;

          if (this.lead && this.lead.preferencia) {
            codCampus = this.lead.preferencia.codCampus;
          } else if (response.result.length == 1) {
            codCampus = response.result[0].codigo;
          }

          if (codCampus) {
            var poloselecionado = response.result.find((x: any) => x.codigo === codCampus);
            if (poloselecionado) {
              this.poloselecionado = poloselecionado;

              this.onChangePolo(poloselecionado);

              if (this.polo) {
                this.polo.setSelected(poloselecionado);
              }
            }
          }
        }
      }, (err: HttpErrorResponse) => {
        this.NgxSpinnerService.hide('edit');
      });
  }

  AddTagsGTM() {
    App.clearTags();

    if (this.fi == "VESTIBULAR 100%" && !this.convenioParceiro)
      App.tagGTMVestibular100();
    else if (this.ps == "GRADUAÇÃO PRESENCIAL" && !this.convenioParceiro)
      App.tagGTMPresencial();
    else if (this.ps == "GRADUAÇÃO PRESENCIAL" && this.convenioParceiro == "ifood")
      App.tagGTMPresencialIfood();
    else if (this.ps == 'EAD' && !this.convenioParceiro)
      App.tagGTMEAD();
    else if (this.ps == 'EAD' && this.convenioParceiro == "ifood")
      App.tagGTMEADIfood();
    else if (this.ps == 'PÓS-GRADUAÇÃO EAD' && !this.convenioParceiro)
      App.tagGTMPosEAD();
    else if (this.ps == 'GRADUAÇÃO SEMIDIGITAL' && !this.convenioParceiro)
      App.tagGTMSemidigital();
    else if (this.ps == "GRADUAÇÃO SEMIDIGITAL" && this.convenioParceiro == "ifood")
      App.tagGTMSemidigitalIfood();
    else if (this.ps == 'MEDICINA' && !this.convenioParceiro)
      App.tagGTMMedicina();
  }

  private MontarFiltro(): Filtro {
    const filtro = new Filtro();

    if (this.processoselecionado) {
      const { categoriaPs, codFilial, codTipoCurso, idCategoriaPs } = this.processoselecionado;

      filtro.codFilial = codFilial;
      filtro.categoriaPs = categoriaPs;
      filtro.codTipoCurso = codTipoCurso;
      filtro.idCategoriaps = idCategoriaPs;
    }
    if (this.calendarioselecionado) {
      const { calendario, idPerLet } = this.calendarioselecionado;
      filtro.calendario = calendario;
      filtro.idPerlet = idPerLet;
    }
    if (this.cursoselecionado) {
      const { codCurso, codTipoHabilitacao } = this.cursoselecionado;

      filtro.codCurso = codCurso;
      filtro.codTipoHabilitacao = codTipoHabilitacao;
    }
    if (this.turnoselecionado) {
      const { codTurno, idAreaInteresse } = this.turnoselecionado;

      filtro.codTurno = codTurno;
      filtro.idAreaInteresse = idAreaInteresse;
    }

    if (this.poloselecionado) {
      const { codigo } = this.poloselecionado;

      filtro.codCampus = codigo;
    }

    if (this.formaingressoselecionada) {
      const { idPs, idFormaInscricao } = this.formaingressoselecionada;

      filtro.idPs = idPs;
      filtro.idFormaInscricao = idFormaInscricao;
    }

    if (this.convenio) {
      filtro.codBolsa = this.convenio;
    }

    if (this.fi) {
      filtro.formaIngresso = this.fi;
    }

    if (this.codPerLet) {
      filtro.codPerLet = this.codPerLet;
    }

    filtro.ignoraFimInscricao = this.ignoraFimInscricao;

    return filtro;
  }
  private ResetarCombos(acao: Acoes): any {
    switch (acao) {
      case Acoes.ProcessoSeletivo: // Processo Seletivo
        this.calendarios = [];
        this.processoselecionado = null;
        this.inscricao.codTipoCurso = null;
      case Acoes.Calendario:
        this.cursos = [];
        this.calendarioselecionado = null;

        this.showCurso = false;
      case Acoes.Curso:
        this.turnos = [];
        this.cursoselecionado = null;
        this.inscricao.codFilial = null;
        this.inscricao.codCurso = null;

        this.showTurno = false;
      case Acoes.Turno:
        this.formasingressos = [];
        this.turnoselecionado = null;
        this.inscricao.codTurno = null;

        this.showFormaIngresso = false;
      case Acoes.FormaIngresso:
        this.estados = [];

        this.formaingressoselecionada = null;
      case Acoes.EstadoPolo:
        this.cidades = [];

        this.estadoselecionado = null;
      case Acoes.CidadePolo:
        this.polos = [];

        this.cidadeselecionada = null;
      case Acoes.Polo:
        this.poloselecionado = null;

        if (this.lead) {
          this.lead.preferencia = null;
        }
    }
  }
  private ExibirCarregando(nameList: string, element: string) {
    this[nameList] = [{ id: '', texto: 'Carregando...', valor: '', selected: true, disabled: true }];

    this[element]?.setSelected('');
  }
  private ExibirSelecione(nameList: string, element: string) {
    this[nameList] = [{ id: '', texto: 'Selecione uma opção...', valor: '', selected: true, disabled: false }];

    this[element]?.setSelected('');
  }

  getCateforiaPs(ps: string) {
    switch (ps.toUpperCase()) {
      case 'MEDICINA':
        return 'MEDICINA';
      case 'EAD':
        return 'EAD';
      case 'SEMIPRESENCIAL':
        return 'GRADUAÇÃO SEMIPRESENCIAL'
      case 'PRESENCIAL':
        return 'GRADUAÇÃO PRESENCIAL';
      default:
        return null;
    }
  }
}

interface Response {
  statusCode: number;
  result: any;
  message: string;
}
