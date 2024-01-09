import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from 'src/app/services/auth/auth.service';
import { CandidatoService } from '@services/candidato.service';
import { HttpErrorResponse } from '@angular/common/http';
import { StepsService } from '@services/steps.service';
import { StageEnum } from 'src/app/models/stage.enum';
import { CrmService } from '@services/Crm.service';
import { BaseResponse } from 'src/app/models/BaseResponse';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  user = {
    cpf: '',
    password: ''
  };

  constructor(
    private _authService: AuthService,
    private candidatoService: CandidatoService,
    private StepsService: StepsService,
    private router: Router,
    private toastr: ToastrService,
    private NgxSpinnerService: NgxSpinnerService,
    private crmService: CrmService
  ) {
  }

  ngOnInit(): void {
    this.StepsService.clearSteps();
    this.StepsService.setCurrentStepByStage(StageEnum.Cadastro);

    if (this._authService.loggedIn()) {
      this.NgxSpinnerService.show();

      this.candidatoService.ConsultarInfoAcesso().subscribe((response2: any) => {
        if (response2.statusCode === 200) {
          const { primeiroAcesso, codPsPessoa } = response2.result;

          sessionStorage.setItem('cp', codPsPessoa);

          this.candidatoService.GetResponsavel().subscribe((responseResponsavel: any) => {
            this.NgxSpinnerService.hide();

            if (responseResponsavel.statusCode == 200) {
              sessionStorage.setItem('cr', responseResponsavel.result.codPsPessoa);
            }
            if (primeiroAcesso === true) {
              this.router.navigate(['/']);
            } else {
              this.router.navigate(['/painel-candidato']);
            }
          });
        } else {
          this.NgxSpinnerService.hide();
        }
      }, (err: HttpErrorResponse) => { });
    } else {
      sessionStorage.clear();
    }
  }

  ngAfterViewInit(): void {
    var indexBackGroundDiv = document.getElementsByClassName('index-background') as HTMLCollectionOf<HTMLElement>;
    indexBackGroundDiv[0].style["background-color"]="#FF8400";
  }

  validaFormLogin() {
    if (this.user.cpf === "" || this.user.cpf === undefined) {
      this.toastr.error("Favor preencher todos os campos.");
    } else if (this.user.password === "" || this.user.password === undefined) {
      this.toastr.error("Favor preencher todos os campos.");
    } else {
      this.user.cpf = this.user.cpf.replace(/([^\d])+/gim, '');
      this.signIn();
    }
  }

  signIn() {
    this.NgxSpinnerService.show();
    this._authService.loginService(this.user)
      .subscribe((response: any) => {
        if (response.statusCode === 200) {
          //SE A API RETORNAR ESSE PARAMETRO COMO TRUE SIGNIFICA QUE O USUARIO ESTÁ ACESSANDO SUA CONTA PORÉM NÃO EFETUOU A TROCA DE SENHA, ENTÃO REDIRECIONÁ-LO PARA A TELA DE TROCA
          //DE SENHA
          // if (response.result.VerificaHash) {
          //   sessionStorage.setItem('cpf', response.result.cpf);
          //   this.router.navigate([`/refazerSenha&hash=${response.result.hash}`]);
          // } else {}
          sessionStorage.setObject('user', response.result);
          // TODO: Validar se o usuario será direcionado para o painel ou fluxo de primeiro acesso
          this.candidatoService.ConsultarInfoAcesso().subscribe((response2: any) => {
            if (response2.statusCode === 200) {
              const { primeiroAcesso, codPsPessoa, etapa } = response2.result;

              sessionStorage.setItem('cp', codPsPessoa);
              sessionStorage.setItem('etapa', etapa);

              this.candidatoService.GetResponsavel().subscribe((responseResponsavel: any) => {
                this.NgxSpinnerService.hide();

                if (responseResponsavel.statusCode == 200) {
                  sessionStorage.setItem('cr', responseResponsavel.result.codPsPessoa);
                }

                if (primeiroAcesso === true) {

                  this.router.navigate(['/']);
                } else {
                  //SE TUDO DER CERTO ENTÃO CHAMAR O MÉTODO PARA VERIFICAR SE O USUARIO TEM CADASTRO NO CRM
                  this.crmService.VerificarUsuarioCRM(this.user.cpf).subscribe(
                    {
                      next: (resp: BaseResponse) => {
                        if (resp.statusCode != 200) {
                          console.error(resp.result)
                        }
                      },
                      error: (error: Error) => {
                        console.error(error);
                      }
                    });
                  this.router.navigate(['/painel-candidato']);
                }
                //aqui
              });
            } else {
              this.NgxSpinnerService.hide();

              this.toastr.warning(response.message);
            }
          }, (err: HttpErrorResponse) => {
            this.NgxSpinnerService.hide();
            this.toastr.error("Sistema indisponível no momento.");
          });

        } else {
          this.NgxSpinnerService.hide();
          this.toastr.warning(response.message);
        }
      });
  }
}
