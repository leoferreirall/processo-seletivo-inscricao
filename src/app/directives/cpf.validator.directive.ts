import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

import { cpf as validatorCPF } from 'cpf-cnpj-validator'; 

@Directive({
    selector: '[validateCPF][formControlName],[validateCPF][formControl],[validateCPF][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => CPFValidator), multi: true }
    ]
})
export class CPFValidator implements Validator {
    constructor(@Attribute('validateCPF') public validateCPF: string) { }

    validate(cpf: AbstractControl): { [key: string]: any } {
        
        if (!validatorCPF.isValid(cpf.value)) {
            return {
                validatePhone: false
            };
        }

        return null;
    }
}