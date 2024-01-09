import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from '@services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseResponse } from 'src/app/models/BaseResponse';
import { CandidatoService } from '@services/candidato.service';
import { CrmService } from '@services/Crm.service';
import { AcessoToscanaService } from '@services/acessoToscana.service';

@Component({
  selector: 'app-AcessoPainelToscana',
  templateUrl: './AcessoPainelToscana.component.html',
  styleUrls: ['./AcessoPainelToscana.component.scss']
})
export class AcessoPainelToscanaComponent implements OnInit {

  private cpf = sessionStorage.getItem('c');
  public terminarAcesso = false;

  constructor(private spinner: NgxSpinnerService,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private candidatoService: CandidatoService,
    private crmService: CrmService,
    private acessoToscanaService: AcessoToscanaService) { }

  ngOnInit() {
    this.Iniciar()
  }
  private Iniciar() {
    if (this.cpf) {
      this.spinner.show();
      setTimeout(() => {
        this.signIn();
      }, 2000)
    }
    else {
      this.terminarAcesso = true;
    }
  }
  private signIn() {
    this.authService.loginToscanaService(this.cpf)
      .subscribe((response: any) => {
        if (response.statusCode === 200) {
          sessionStorage.setObject('user', response.result);
          sessionStorage.removeItem('c');
          sessionStorage.removeItem('token_access');
          sessionStorage.setItem('acesso', 'toscana');
          // TODO: Validar se o usuario será direcionado para o painel ou fluxo de primeiro acesso
          this.candidatoService.ConsultarInfoAcesso().subscribe((response2: any) => {
            if (response2.statusCode === 200) {
              const { primeiroAcesso, codPsPessoa, etapa } = response2.result;

              sessionStorage.setItem('cp', codPsPessoa);
              sessionStorage.setItem('etapa', etapa);
              sessionStorage.setItem('primeiroAcesso', primeiroAcesso);

              this.candidatoService.GetResponsavel().subscribe((responseResponsavel: any) => {
                this.spinner.hide();

                if (responseResponsavel.statusCode == 200) {
                  sessionStorage.setItem('cr', responseResponsavel.result.codPsPessoa);
                }

                if (primeiroAcesso === true) {

                  this.router.navigate(['/']);
                } else {
                  //SE TUDO DER CERTO ENTÃO CHAMAR O MÉTODO PARA VERIFICAR SE O USUARIO TEM CADASTRO NO CRM
                  this.crmService.VerificarUsuarioCRM(this.cpf).subscribe(
                    {
                      next: (resp: BaseResponse) => {
                        if (resp.statusCode != 200) {
                          console.error(resp.message)
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
              this.spinner.hide();

              this.toastr.warning(response.message);
            }
          }, (err: HttpErrorResponse) => {
            this.spinner.hide();
            this.toastr.error("Sistema indisponível no momento.");
          });

        } else {
          this.spinner.hide();
          this.toastr.warning(response.message);
          this.router.navigate(['/painel-candidato']);
        }
      });
  }

}
