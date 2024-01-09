import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

declare var moment: any;

@Component({
  selector: 'app-dados-pessoais',
  templateUrl: './dados-pessoais.component.html',
  styleUrls: ['./dados-pessoais.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class DadosPessoaisComponent implements OnInit {
  @Input() disabled: boolean;
  @Input() responsavel: boolean;
  @Input() disableCPF: boolean;
  @Input() form: NgForm;

  responsavelEdit: boolean;

  model: any = {};

  constructor() { }

  ngOnInit(): void {

  }

  public ValidaEmail(emailObj: any) {
    var email = emailObj.model.email;
    var regex = new RegExp(/(.)\1{2}/);
    if (regex.test(email)) {
      this.form.controls['email'].setErrors({ 'incorrect': true });

      Swal.fire({
        title: '<strong style="color:#ff5c00">Digite um e-mail valido</strong>',
        text: 'Utilizaremos este e-mail para contato ',
        icon: 'info',
        showCancelButton: false,
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#ff5c00'
      });
      // sessionStorage.setItem("emailAlert", 'true');
    }
    // else {
    //   sessionStorage.removeItem("emailAlert");
    // }
  }

  getModel(): any {
    if (this.responsavel) {
      this.model.datanascimento = moment(this.model.dataNascimentoSemFormatacao, "DDMMYYYY").format("YYYY-MM-DD");
    }

    return this.model;
  }
  setModel(model: any) {
    if (model.datanascimento) {
      model.dataNascimentoSemFormatacao = moment(model.datanascimento).format("DDMMYYYY");
    }

    if (this.responsavel) {
      this.responsavelEdit = true;
    } else {
      this.responsavelEdit = false;
    }

    if (model.cpf) {
      this.disableCPF = true;
    } else {
      this.disableCPF = false;
    }

    this.model = model;
  }
}
