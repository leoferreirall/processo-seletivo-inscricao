import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
    selector: 'app-alterar-senha',
    templateUrl: './alterar-senha.component.html',
    styleUrls: ['./alterar-senha.component.scss']
})
export class AlterarSenhaComponent implements OnInit {
    @ViewChild('form') form: NgForm;
    
    title = 'Alterar Senha';

    model: any = {};

    constructor(private AuthService: AuthService,
        private toastr: ToastrService,
        private NgxSpinnerService: NgxSpinnerService) {

    }

    ngOnInit() {

    }

    onSubmit(model){
        this.NgxSpinnerService.show();

        this.AuthService.alterarSenha(model).subscribe((response: any) => {
            this.NgxSpinnerService.hide();

            this.form.resetForm();

            if(response.statusCode == 404){
                this.toastr.warning(response.message);
            } else if(response.statusCode != 200){
                this.toastr.error(response.message);
            } else{
                this.toastr.success("Senha alterada com sucesso!");
            }
        });
    }
}