import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { disableDebugTools } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { InscricaoService } from '@services/inscricao.service';
import { StepsService } from '@services/steps.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CupomPromocionalComponent } from 'src/app/components/cupom-promocional/cupom-promocional.component';
import { DadosComplementaresComponent } from 'src/app/components/dados-complementares/dados-complementares.component';
import { DadosPessoaisComponent } from 'src/app/components/dados-pessoais/dados-pessoais.component';
import { DeficienciaComponent } from 'src/app/components/deficiencia/deficiencia.component';
import { EnderecoComponent } from 'src/app/components/endereco/endereco.component';
import { PlanosCondicoesComponent } from 'src/app/components/planos-condicoes/planos-condicoes.component';
import { Response } from 'src/app/models/response.model';
import { StageEnum } from 'src/app/models/stage.enum';
import { AcessoToscana } from 'src/app/Shared/AcessoToscana';
import { InscricaoMatriculaService } from 'src/app/Shared/Services/InscricaoMatricula.service';
import { MsgModal } from 'src/app/Shared/Services/MsgModal';
import Swal from 'sweetalert2';
import { SweetAlertOptions, SweetAlertInput } from 'sweetalert2';

declare var moment: any;
declare var App: any;

@Component({
  selector: 'app-complemento',
  templateUrl: './complemento.component.html',
  styleUrls: ['./complemento.component.scss']
})
export class ComplementoComponent implements OnInit {
  @ViewChild(DadosComplementaresComponent) complementares: DadosComplementaresComponent;
  @ViewChild(DadosPessoaisComponent) dadosResponsavel: DadosPessoaisComponent;
  @ViewChild(DeficienciaComponent) deficiencia: DeficienciaComponent;
  @ViewChild(CupomPromocionalComponent) cupom: CupomPromocionalComponent;
  @ViewChild(EnderecoComponent) endereco: EnderecoComponent;
  @ViewChild(PlanosCondicoesComponent, { static: true }) planos: PlanosCondicoesComponent;
  @ViewChild('form') form: NgForm;
  public idConsultor: string;

  detalheInscricao: any = {};

  enderecoselecionado: any = {};
  complemento: any = {};
  lead: any = {};

  uidl: number = null;
  uidi: number = null;
  cp: number = null;
  novainscricao: boolean;

  ignoraFimInscricao: boolean;

  permiteEdicao: boolean;

  edit: boolean = false;

  public codBolsaApi: string;

  isBlackFAMDayBool: boolean;

  public codPsBolsa = '';

  constructor(
    private StepsService: StepsService,
    private service: InscricaoService,
    private authService: AuthService,
    private toastr: ToastrService,
    private NgxSpinnerService: NgxSpinnerService,
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    private InscricaoService: InscricaoMatriculaService
  ) { }

  ngOnInit(): void {
    const hoje = new Date();
    this.isBlackFAMDayBool = ((hoje.getFullYear() * 10000) + ((hoje.getMonth() + 1) * 100) + (hoje.getDate()) >= 20221130) && ((hoje.getFullYear() * 10000) + ((hoje.getMonth() + 1) * 100) + (hoje.getDate()) <= 20230103);

    this.NgxSpinnerService.show('edit');

    var v = sessionStorage.getObject('v');

    this.ignoraFimInscricao = this.ActivatedRoute.snapshot.data["ignoraFimInscricao"] || false;

    if (!v) {
      setTimeout(() => this.StepsService.clearSteps());
    }

    this.uidl = sessionStorage.getObject('uidl');
    this.uidi = sessionStorage.getObject('uidi');
    this.cp = sessionStorage.getObject('cp');
    this.novainscricao = !this.uidi;

    const bolsa = this.ActivatedRoute.snapshot.queryParamMap.get('bolsa');


    if (bolsa) {
      this.salvarCodBolsa(bolsa);
      setTimeout(() => {
        this.planos.setConvenio(bolsa);
      });
    }

    this.edit = true;

    if (this.cp && this.uidi) {
      this.service.ConsultarDetalheInscricao(this.uidi, this.cp)
        .subscribe((response: Response) => {
          if (response.statusCode === 200) {
            this.detalheInscricao = response.result;

            const {
              permiteEdicao,
            } = response.result;

            this.permiteEdicao = permiteEdicao;

            this.StepsService.setSequenciaSteps(response.result);

            this.carregarDadosComplementares();
          } else {
            this.NgxSpinnerService.hide('edit');
          }
        });
    } else {
      this.service.GetInfoIncricaoByLead(this.uidl)
        .subscribe((response: Response) => {
          if (response.statusCode === 200) {
            //SE NÃO FOR ENCONTRADO O DETALHE DA INSCRIÇÃO ENTÃO ENVIAR MSG DE ERRO E REDIRECIONAR PARA O INICIO
            if (!response.result) {
              this.NgxSpinnerService.hide('edit');
              MsgModal.msgErro('Não foi encontrado uma inscrição válida!', 'Por favor tente criar uma nova inscrição', () => { this.router.navigate(['/painel-do-candidato']); })
            }
            else {
              this.detalheInscricao = response.result;
              this.carregarDadosComplementares();
            }
          } else {
            this.NgxSpinnerService.hide('edit');
            //SE NÃO FOR ENCONTRADO O DETALHE DA INSCRIÇÃO ENTÃO ENVIAR MSG DE ERRO E REDIRECIONAR PARA O INICIO
            if (!response.result) {
              MsgModal.msgErro('Não foi encontrado uma inscrição válida!', 'Por favor tente criar uma nova inscrição', () => { this.router.navigate(['/painel-do-candidato']); })
            }
          }
        });

      this.permiteEdicao = true;
    }
  }

  private salvarCodBolsa(codBolsa: string){
    sessionStorage.setItem('codBolsa', codBolsa);
  }


  carregarDadosComplementares() {
    if (this.authService.loggedIn() && (this.uidi || this.novainscricao)) {
      this.service.ConsultarInfoComplementoInscricao(this.uidi, this.uidl)
        .subscribe((response: Response) => {
          if (response.statusCode === 200) {
            const {
              cpf,
              nomeSocial,
              rg,
              dtNascimento,
              sexo,
              deficienteAuditivo,
              deficienteFala,
              deficienteFisico,
              deficienteIntelectual,
              deficienteMental,
              deficienteMobReduzida,
              deficienteVisual,
              deficienteObservacao,
              codLogradouro,
              logradouro,
              codTipoRua,
              numero,
              complemento,
              codBairro,
              bairro,
              codTipoBairro,
              uf,
              estado,
              codMunicipio,
              codLocalidade,
              cidade,
              idPais,
              codPais,
              pais,
              cep,
            } = response.result.dados;

            this.idConsultor = response.result.dados.idConsultor;
            this.codBolsaApi = response.result.dados.codBolsa;

            this.complemento.cpf = cpf;
            const codBolsa = response.result.codBolsa;

            if (codBolsa) {
              this.codPsBolsa = codBolsa;

              this.salvarCodBolsa(codBolsa)
              this.NgxSpinnerService.hide('edit');

              this.planos.setConvenio(codBolsa);

            } else {
              this.carregarInformacoes();
            }

            const possuiDeficiencia =
              deficienteAuditivo ||
              deficienteFala ||
              deficienteFisico ||
              deficienteIntelectual ||
              deficienteMental ||
              deficienteMobReduzida ||
              deficienteVisual ||
              false;

            this.complementares.setModel({ nomesocial: nomeSocial, rg, datanascimento: dtNascimento?.substring(0, 10), sexo, possuiDeficiencia });

            this.deficiencia.setModel({
              possuiDeficiencia,
              deficienteAuditivo,
              deficienteFala,
              deficienteFisico,
              deficienteIntelectual,
              deficienteMental,
              deficienteMobReduzida,
              deficienteVisual,
              deficienteObservacao
            });

            this.endereco.setModel({
              codLogradouro,
              logradouro,
              codTipoRua,
              numero,
              complemento,
              codBairro,
              bairro,
              codTipoBairro,
              uf,
              estado: uf,
              codMunicipio,
              codLocalidade,
              cidade,
              idPais,
              codPais,
              pais,
              cep
            });

            setTimeout(() => {
              const {
                nomeResp,
                cpfResp,
                emailResp,
                celularResp,
                telefoneResp,
                dtNascimentoResp
              } = response.result.dados;

              if (this.dadosResponsavel && nomeResp) {

                this.dadosResponsavel.setModel({
                  nome: nomeResp,
                  cpf: cpfResp,
                  celular: celularResp,
                  telefone: telefoneResp,
                  email: emailResp,
                  confirmacaoemail: emailResp,
                  datanascimento: dtNascimentoResp
                });
              }
            });
          } else {
            this.NgxSpinnerService.hide('edit');
          }
        }, ((err: HttpErrorResponse) => { }));
    } else {
      this.NgxSpinnerService.hide('edit');

      setTimeout(() => {
        this.complementares.setModel({ possuiDeficiencia: false });
      });
    }
  }

  carregarInformacoes() {
    this.service.ConsultarInfoInscricao({
      codpslead: this.uidl,
      codpsinscricao: this.uidi
    }).subscribe((response: Response) => {
      this.NgxSpinnerService.hide('edit');

      if (response.statusCode === 200) {
        this.lead = response.result;

        const codBolsa = this.lead?.preferencia?.codBolsa;
        this.codPsBolsa = codBolsa;

        this.salvarCodBolsa(this.codPsBolsa);

        if (codBolsa) {
          this.planos?.setConvenio(codBolsa);
        }
      }
    }, ((err: HttpErrorResponse) => {
      this.NgxSpinnerService.hide('edit');
    }));
  }

  public temBolsa(){
    return
  }

  public InscricaoIfood(){
    var codBolsa = sessionStorage.getItem('codBolsa');

    return codBolsa == '266'
  }

  onChangeEndereco(e) {
    this.enderecoselecionado = e;
  }
  onChangeOption(e: boolean) {
    this.deficiencia.setShow(e);
  }

  async onSubmit(substituir: boolean = false, matriculaConfirmada: boolean = false) {
    const { nomesocial, rg, datanascimento, sexo } = this.complementares.getModel();
    const deficiencia = this.deficiencia.getModel();
    const { cupompromocional } = this.cupom.getModel();
    const endereco = this.endereco.getModel();
    const convenio = this.planos?.getConvenio();

    if (!this.deficiencia.validar()) {
      this.toastr.warning("Favor informar ao menos uma deficiência");

      return;
    }

    if (convenio) {
      this.complemento.codbolsa = convenio;
    }

    this.complemento.codpsinscricao = this.uidi;
    this.complemento.codpslead = this.uidl;

    this.complemento.nomesocial = nomesocial?.toUpperCase();
    this.complemento.rg = rg;
    this.complemento.dtnascimento = datanascimento;
    this.complemento.sexo = sexo;
    this.complemento.idconsultor = cupompromocional == undefined ? this.idConsultor : cupompromocional;
    this.complemento.deficiencia = deficiencia;
    this.complemento.endereco = endereco;
    this.complemento.substituir = substituir;
    this.complemento.MatriculaConfirmada = matriculaConfirmada;

    this.complemento.urlInterna = this.ignoraFimInscricao;

    if (this.verificaMenorIdade() || this.detalheInscricao.processoSeletivo == 'MEDICINA') {
      const { nome, telefone, celular, email, confirmacaoemail, cpf, datanascimento } = this.dadosResponsavel.getModel();

      this.complemento.responsavel = {
        nome: nome.toUpperCase(),
        cpf: cpf,
        email: email,
        celular: celular,
        telefone: telefone,
        dtNascimentoResp: datanascimento,
        endereco: endereco
      };
    }
    //
    this.NgxSpinnerService.show();

    this.service.GravarDadosComplementares(this.complemento).subscribe(async (response: Response) => {
      if (response.statusCode === 200) {

        //SE A API ENVIOU QUE EXISTE MATRICULA ENTÃO EFETUAR UMA OUTRA PERGUNTA E SE ACEITO LIBERAR O CADASTRO DA MATRICULA
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
          const { codPsInscricao, codPsPessoa } = response.result;

          this.uidi = codPsInscricao;

          sessionStorage.removeItem('v');

          sessionStorage.setItem("cp", codPsPessoa);
          //VERIFRICANDO SE O USUÁRIO JÁ EFETUOU O LOGIN OU SE O USUÁRIO É A TOSCANA E SE O USUÁRIO NUNCA EFETUOU LOGIN
          if (!this.cp || (AcessoToscana.verificaAcessoToscana() && AcessoToscana.primeiroAcesso())) {
            this.NgxSpinnerService.hide();

            this.cp = codPsPessoa;

            sessionStorage.removeItem('uidl');
            sessionStorage.removeItem('user');

            this.login();
          } else {
            this.concluir();
          }
        }
      } else if (response.statusCode === 400) {
        this.toastr.warning(response.message);

        this.NgxSpinnerService.hide();
      }
    }, (err: HttpErrorResponse) => {
      this.NgxSpinnerService.hide();
    });
  }

  //VERIFICAR COM O RICARDO ESSE RETORNO
  public login() {
    Swal.fire({
      allowOutsideClick: false,
      title: '<strong style="color:#ff5c00">Pronto! Sua inscrição foi concluída</strong>',
      text: 'Para continuar acesse o link enviado no seu e-mail, e altere sua senha',
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: 'Continuar',
      confirmButtonColor: '#ff5c00',
    }).then(() => {
      sessionStorage.clear();
      this.router.navigate(['/painel-do-candidato']);
    })
    // Swal.fire({
    //   allowOutsideClick: false,
    //   title: '<strong style="color:#ff5c00">Pronto! Sua inscrição foi concluída</strong>',
    //   text: 'Para continuar informe a senha enviada para seu e-mail e telefone',
    //   icon: 'success',
    //   input: 'password',
    //   inputPlaceholder: 'Senha',
    //   showCancelButton: true,
    //   cancelButtonText: 'Cancelar',
    //   confirmButtonText: 'Continuar',
    //   confirmButtonColor: '#ff5c00',
    //   inputValidator: (value) => {
    //     if (!value) {
    //       return "Favor informar a senha";
    //     }
    //   }
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     this.NgxSpinnerService.show();

    //     this.authService.loginService({ cpf: this.complemento.cpf, password: result.value })
    //       .subscribe((response: Response) => {
    //         if (response.statusCode == 200) {
    //           sessionStorage.setObject('cp', this.cp);
    //           sessionStorage.setObject('uidl', this.uidl);
    //           sessionStorage.setObject('user', response.result);

    //           this.concluir();
    //         } else if (response.statusCode == 404) {
    //           this.login();

    //           this.NgxSpinnerService.hide();

    //           this.toastr.warning(response.message);
    //         } else {
    //           this.login();

    //           this.NgxSpinnerService.hide();

    //           this.toastr.error("Erro ao efetuar login, favor tente novamente");
    //         }
    //       });
    //   } else {
    //     this.router.navigate(['/painel-do-candidato']);
    //   }
    // });
  }

  concluir() {
    sessionStorage.setObject('uidi', this.uidi);

    this.service.ConsultarDetalheInscricao(this.uidi, this.cp)
      .subscribe((response: Response) => {

        if (response.statusCode === 200) {
          this.StepsService.clearSteps();

          this.StepsService.setSequenciaSteps(response.result);

          this.NgxSpinnerService.hide();

          if (!this.StepsService.isLastStep()) {
            this.StepsService.moveToNextStep();
          }
        }
      });
  }

  verificaMenorIdade() {
    if (this.complementares) {
      const { datanascimento } = this.complementares?.getModel();

      if (datanascimento?.length == 10 && moment(datanascimento, "YYYY-MM-DD").isValid()) {
        var dataNascimentoFormatada = moment(datanascimento, "YYYY-MM-DD").format("YYYY-MM-DD");

        if (moment().diff(dataNascimentoFormatada, 'years') < 18) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  isBlackFAMDay() {
    var indexBackGroundDiv = document.getElementsByClassName('index-background') as HTMLCollectionOf<HTMLElement>;
    indexBackGroundDiv[0].style["background-color"] = "#120624";
    var sideImgBlackFAMdayLeft = document.getElementById('img-side-black-famday-left');
    if (sideImgBlackFAMdayLeft != null) {
      sideImgBlackFAMdayLeft.style.display = "inline";
    }
    var sideImgBlackFAMdayRight = document.getElementById('img-side-black-famday-right');
    if (sideImgBlackFAMdayRight != null) {
      sideImgBlackFAMdayRight.style.display = "inline";
    }
    return true;
  }

  isNotBlackFAMDay() {
    var indexBackGroundDiv = document.getElementsByClassName('index-background') as HTMLCollectionOf<HTMLElement>;
    indexBackGroundDiv[0].style["background-color"] = "#FF8400";

    var sideImgBlackFAMdayLeft = document.getElementById('img-side-black-famday-left');
    if (sideImgBlackFAMdayLeft != null) {
      sideImgBlackFAMdayLeft.style.display = "none";
    }
    var sideImgBlackFAMdayRight = document.getElementById('img-side-black-famday-right');
    if (sideImgBlackFAMdayRight != null) {
      sideImgBlackFAMdayRight.style.display = "none";
    }
    return true;
  }
}
