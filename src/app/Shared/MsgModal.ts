import { Router } from "@angular/router";
import Swal from "sweetalert2";

export class MsgModal {
  constructor(
    private router: Router,
  ) { }

  static msgErro(title: string, text: string, acao: any): void{
    Swal.fire({
      title: `<strong style="color:#ff5c00">${title}</strong>`,
      text: `${text}`,
      icon: 'error',
      showCancelButton: false,
      confirmButtonText: 'Continuar',
      confirmButtonColor: '#ff5c00'
    }).then(acao);
  }
}
