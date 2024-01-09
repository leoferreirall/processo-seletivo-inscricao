import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class InscricaoMatriculaService {

  // PARAMETROS REUTILIZAVEIS
  private showCancelButton = true;
  private cancelButtonColor = '#d33';
  private confirmButtonText = 'Continuar';
  private confirmButtonColor = '#ff5c00';

  constructor() { }

  public MsgCancelarInscricao(result: any): any {
    return {
      title: `<strong style="color:#ff5c00"> ${result.msg} Deseja cancelar a inscrição anterior e prosseguir?</strong>`,
      text: 'Aviso: Contratos aceitos ou requesitos aprovados, serão perdidos.',
      icon: 'question',
      showCancelButton: this.showCancelButton,
      cancelButtonColor: this.cancelButtonColor,
      confirmButtonText: this.confirmButtonText,
      confirmButtonColor: this.confirmButtonColor,
    }
  }

  public MsgConfirmarMatricula(result: any): any {
    return {
      title: `<strong style="color:#ff5c00">${result.msg}</strong>`,
      icon: 'question',
      showCancelButton: this.showCancelButton,
      cancelButtonColor: this.cancelButtonColor,
      confirmButtonText: this.confirmButtonText,
      confirmButtonColor: this.confirmButtonColor,
    }
  }
}
