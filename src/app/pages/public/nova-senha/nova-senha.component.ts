import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from 'src/app/services/auth/auth.service';
import { CandidatoService } from '@services/candidato.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-nova-senha',
  templateUrl: './nova-senha.component.html',
  styleUrls: ['./nova-senha.component.scss']
})
export class NovaSenhaComponent implements OnInit {

  cpf: string;
  email: string;

  constructor(
    private _authService: AuthService,
    private candidatoService: CandidatoService,
    private router: Router,
    private toastr: ToastrService,
    private NgxSpinnerService: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    if (this._authService.loggedIn()) {
      this.candidatoService.ConsultarInfoAcesso().subscribe((response2: any) => {
        if (response2.statusCode === 200) {
          const { primeiroAcesso } = response2.result;
          if (primeiroAcesso === true) {
            this.router.navigate(['/primeiro-acesso']);
          } else {
            this.router.navigate(['/painel-candidato']);
          }
        }
      }, (err: HttpErrorResponse) => { });
    }
  }

  ngAfterViewInit(): void {
    var indexBackGroundDiv = document.getElementsByClassName('index-background') as HTMLCollectionOf<HTMLElement>;
    indexBackGroundDiv[0].style["background-color"]="#FF8400";
  }

  gerarSenha(cpf) {
    this.NgxSpinnerService.show();

    this._authService.gerarSenha(cpf)
      .subscribe((response: any) => {
        this.NgxSpinnerService.hide();

        if (response.statusCode === 200) {
          this.email = response.result;

          Swal.fire({
            title: '<strong style="color:#ff5c00">Será enviada um link para o e-mail</strong>',
            text: this.email,
            icon: 'info',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Continuar',
            confirmButtonColor: '#ff5c00'
          }).then((result) => {
            if (result.isConfirmed) {
              this.NgxSpinnerService.show();

              this._authService.confirmaGerarSenha(cpf)
                .subscribe((response: any) => {
                  this.NgxSpinnerService.hide();

                  if (response.statusCode === 200) {
                    this.toastr.success(response.result);

                    this.router.navigate(['/painel-do-candidato']);
                  } else {
                    this.toastr.warning(response.message);
                  }
                });
            }
          });
        } else {
          this.toastr.warning(response.message);
        }
      });
  }

  confirmaGerarSenha(cpf: string) {
    $('#modalSubmit').modal('hide');
    this.NgxSpinnerService.show();
    this._authService.confirmaGerarSenha(cpf)
      .subscribe((response: any) => {
        if (response.statusCode === 200) {
          this.toastr.success(response.result);

          this.router.navigate(['/painel-do-candidato']);
        } else {
          this.toastr.warning(response.message);
        }

        this.NgxSpinnerService.hide();
      });
  }
}
