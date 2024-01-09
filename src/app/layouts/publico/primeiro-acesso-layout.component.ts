import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CandidatoService } from '@services/candidato.service';
import { EventEmitterService } from '@services/event-emitter.service';
import { InscricaoService } from '@services/inscricao.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'primeiro-acesso-layout',
  templateUrl: './primeiro-acesso-layout.component.html',
  styleUrls: [
    
  ],
})
export class PrimeiroAcessoLayoutComponent implements OnInit {  

  etapaInscricaoCandidato: number = 0;

  constructor(private service: CandidatoService,
    private router: Router,
    private NgxSpinnerService: NgxSpinnerService) {
  } 

  ngOnInit(): void {
    this.getEtapa();
  }

  getEtapa() {
    this.NgxSpinnerService.show();

    this.service.ConsultarInfoAcesso().subscribe((response: any) => {
      this.NgxSpinnerService.hide();

      if (response.result.primeiroAcesso) {
        if (response.result.etapa == 0) {
          this.etapaInscricaoCandidato = response.result.etapa + 1;
        } else {
          this.etapaInscricaoCandidato = response.result.etapa + 2;
        }

        switch (this.etapaInscricaoCandidato) {
          case 3: //Acessibilidade
            EventEmitterService.get('acessibilidade').emit();

            break;
          case 4: // Telefone
            EventEmitterService.get('telefone').emit();

            break;
          case 5: //E-mail
            EventEmitterService.get('email').emit();

            break;
          case 7: //Confirmação
            EventEmitterService.get('confirmacao').emit();

            break;
        }
      } else {
        this.router.navigate(['/painel-candidato']);
      }
    });
  }

  logOut() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}


interface Response {
  statusCode: number;
  result: any;
  message: string;
}