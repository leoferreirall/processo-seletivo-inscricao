import { Router } from "@angular/router";
import { CrmService } from "@services/Crm.service";
import { HashServiceService } from "@services/HashService.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { ConsultaHashEnum } from "../models/Enums/ConsultaHashEnum";

export class ValidadorHash {

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private hashService: HashServiceService,
    private crmService: CrmService) { }

  // public ValidarHash(retornoHash: number): any{

  //   switch (retornoHash) {
  //     case ConsultaHashEnum.HASH_INVALIDO: {
  //       this.toastr.error("Solicitação inválida!");
  //       this.router.navigate(['/']);
  //       break;
  //     }
  //     case ConsultaHashEnum.HASH_VENCIDO: {
  //       this.mostrarMsg('<strong style="color:#ff5c00">O link acessado expirou</strong>', 'Clique em continuar para receber um novo e-mail',
  //         'info', true, this.enviarEmail(), this.router.navigate(['/']));
  //       break;
  //     }
  //     case ConsultaHashEnum.LIBERAR: {
  //       this.pedirCpf = true;
  //       break;
  //     }
  //     default:
  //       this.toastr.error("Solicitação inválida!");
  //       this.router.navigate(['/']);
  //       break;
  //   }
  // }

}
