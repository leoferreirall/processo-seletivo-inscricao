import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from 'src/app/services/auth/auth.service';
import { CandidatoService } from '@services/candidato.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { HashServiceService } from '@services/HashService.service';
import { ConsultaHashEnum } from 'src/app/models/Enums/ConsultaHashEnum';
import { HashUsuarioCrmRequest } from 'src/app/models/HashUsuarioCrmRequest';
import { BaseResponse } from 'src/app/models/BaseResponse';
import { CrmService } from '@services/Crm.service';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidacaoCampos } from 'src/app/Helpers/ValidacaoCampos';
import { EventosEnum } from 'src/app/models/Enums/EventosEnum.enum';

declare var $: any;

@Component({
  selector: 'app-tela-senha',
  templateUrl: './tela-senha.component.html',
  styleUrls: ['./tela-senha.component.scss']
})
export class TelaSenhaComponent implements OnInit {

  private form!: FormGroup;
  private modelResponse = {} as HashUsuarioCrmRequest
  private hash = sessionStorage.getItem("hash");
  public pedirCpf = false;
  public pedirNovaSenha = false;
  private hashModel = {} as HashUsuarioCrmRequest;
  private modelSenha = {} as any;


  constructor(
    private _authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private hashService: HashServiceService,
    private crmService: CrmService,
    private fb: FormBuilder) { }


  get f(): any { return this.form.controls; }

  ngOnInit() {
    this.validacao();
    this.spinner.show();
    this.hashModel.hash = this.hash;
    this.verificaHash(this.hashModel);
  }

  // // AQUI O SISTEMA IRÁ VERIFICAR SE NA SESSION STOREGE POSSUI ALGUM CPF, SE SIM SIGNIFICA QUE ALGUEM TENTOU LOGAR PORÉM NÃO EFETUOU A REDEFINIÇÃO DE SENHA
  // private verificaSession(){
  //   const cpf = sessionStorage.getItem('cpf');
  //   if (cpf) {
  //     this.hashModel.cpf = cpf;
  //     this.validarCpf();
  //   }
  //   else{}
  // }
  private validacao() {
    const formOptions: AbstractControlOptions = {
      validators: [ValidacaoCampos.MustMatch('password', 'confirmPassword')]
    }

    this.form = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, formOptions);

  }

  public salvarSenha() {
    this.spinner.show();
    if (this.form.valid) {
      this.modelSenha = { ...this.form.value };
      this.modelSenha.cpf = this.hashModel.cpf;
      this._authService.alterarSenhaCrm(this.modelSenha).subscribe({
        next: (resp: BaseResponse) => {
          if (resp.statusCode != 200) {
            this.toastr.warning(resp.message);
          }
          else {
            this.atualizarContatoCrm();
          }
        },
        error: (erro: Error) => {
          this.toastr.error(erro.message);
          this.spinner.hide();
        }
      })
    }
  }

  public validarCpf() {
    this.spinner.show();
    this.hashModel.hash = this.hash;

    this.hashService.ConsultarHashCpf(this.hashModel).subscribe({
      next: (resp: BaseResponse) => {
        if (resp.statusCode != 200) {
          this.toastr.warning(resp.message);
        } else {
          this.retornoHash(resp.result.consultaHashEnum, false);
        }
      },
      error: (erro: Error) => {
        this.toastr.error(erro.message);
      },
      complete: () => {
        this.spinner.hide();
      }
    })
  }
  //MÉTODO RESPONSÁVEL POR TIRAR A URL COM HASH DO CRM
  private atualizarContatoCrm() {
    this.crmService.LimparHashCrm(this.hashModel.cpf).subscribe({
      next: (resp: BaseResponse) => {
        this.mostrarMsg("Senha alterada com sucesso", "Você será direcionado para a tela de login, por favor efetue o acesso com seu CPF e senha",
          "success", false, EventosEnum.RETORNAR_PAINEL_CANDIDATO, null);
          if (!resp.result){
            console.error("O hash não foi limpo do CRM");
          }
      },
      error: (error: Error) => {
        this.toastr.error(error.message);
      },
      complete: () => {
        this.spinner.hide();
      }
    })
  }

  private enviarEmail(): any {
    this.spinner.show();
    this.crmService.EnviarEmailViaCrm(this.modelResponse).subscribe({
      next: (resp: BaseResponse) => {
        if (resp.statusCode != 200) {
          this.toastr.warning(resp.message);
        }
        else if (resp.result) {
          this.mostrarMsg('E-mail enviado com sucesso', 'Por favor aguarde até que o e-mail chegue até sua caixa de msg, para com isso poder prosseguir',
            'success', false, EventosEnum.RETORNAR_PAINEL_CANDIDATO, null)
        }
      },
      error: (erro: Error) => {
        this.toastr.error(erro.message);
      },
      complete: () => {
        this.spinner.hide();
      }
    })
  }

  private mostrarMsg(title: string, text: string, icon: any, mostrarCancelar: boolean, eventoConfirmar: EventosEnum, eventoCancelar: EventosEnum | null) {
    Swal.fire({
      title: title,
      allowOutsideClick: false,
      text: text,
      icon: icon,
      showCancelButton: mostrarCancelar,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Continuar',
      confirmButtonColor: '#ff5c00'
    }).then((result) => {
      if (result.isConfirmed) {
        this.EfetuarEventos(eventoConfirmar);
        eventoConfirmar;
      }
      else {
        this.EfetuarEventos(eventoCancelar);
      }
    });
  }

  private EfetuarEventos(Eventos: EventosEnum) {
    switch (Eventos) {
      case EventosEnum.RETORNAR_PAINEL_CANDIDATO:
        this.router.navigate(['/painel-do-candidato'])
        break;
      case EventosEnum.RETORNAR_INICIO:
        this.router.navigate(['/'])
        break
      case EventosEnum.ENVIAR_EMAIL: {
        this.enviarEmail();
        break
      }
      default:
        break;
    }
  }

  private retornoHash(retHash: ConsultaHashEnum, pedirCpf: boolean) {
    switch (retHash) {
      case ConsultaHashEnum.HASH_INVALIDO: {
        this.toastr.error("Solicitação inválida!");
        this.router.navigate(['/']);
        break;
      }
      case ConsultaHashEnum.HASH_VENCIDO: {
        this.mostrarMsg('<strong style="color:#ff5c00">O link acessado expirou</strong>', 'Clique em continuar para receber um novo e-mail',
          'info', true, EventosEnum.ENVIAR_EMAIL, EventosEnum.RETORNAR_INICIO);
        break;
      }
      case ConsultaHashEnum.CPF_INVALIDO: {
        this.toastr.error("CPF Inválido");
        break;
      }
      case ConsultaHashEnum.LIBERAR: {
        if (pedirCpf) {
          this.pedirCpf = true;
        } else {
          this.pedirCpf = false;
          this.pedirNovaSenha = true;
        }
        break;
      }
      default:
        this.toastr.error("Solicitação inválida!");
        this.router.navigate(['/']);
        break;
    }
  }

  private verificaHash(modelHash: HashUsuarioCrmRequest): any {

    this.hashService.ConsultarHash(modelHash).subscribe({
      next: (resp: BaseResponse) => {
        this.modelResponse = resp.result as HashUsuarioCrmRequest;
        this.retornoHash(resp.result.consultaHashEnum, true);
      },
      error: (error: Error) => {
        this.toastr.error(error.message);
        this.router.navigate(['/']);
      },
      complete: () => {
        this.spinner.hide();
      }
    })
  }
}
