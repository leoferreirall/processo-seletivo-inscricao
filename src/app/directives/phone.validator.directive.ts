import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[validatePhone][formControlName],[validatePhone][formControl],[validatePhone][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => PhoneValidator), multi: true }
    ]
})
export class PhoneValidator implements Validator {
    constructor(@Attribute('validatePhone') public validatePhone: string) { }

    validate(phone: AbstractControl): { [key: string]: any } {
        
        if (phone.value?.length > 9) {
            var ddd = phone.value.substring(0, 2);
            var numero = phone.value.length == 10 ? phone.value.substring(3) : phone.value.substring(4);
            var numeroInicial = phone.value.substring(2, 3);

            if (ddd < 11 || ddd > 99) {
                return {
                    validatePhone: false
                };
            } else if (numero == '0000000' ||
                numero == '1111111' ||
                numero == '2222222' ||
                numero == '3333333' ||
                numero == '4444444' ||
                numero == '5555555' ||
                numero == '6666666' ||
                numero == '7777777' ||
                numero == '8888888' ||
                numero == '9999999') {
                return {
                    validatePhone: false
                };
            } else if(numeroInicial == '1' || (phone.value.length == 11 && numeroInicial != '9')){
                return {
                    validatePhone: false
                };
            }
        }

        return null;
    }
}