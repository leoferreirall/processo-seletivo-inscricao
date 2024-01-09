import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

declare var moment: any;

@Directive({
    selector: '[validateDateBirth][formControlName],[validateDateBirth][formControl],[validateDateBirth][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => DateBirthValidator), multi: true }
    ]
})
export class DateBirthValidator implements Validator {
    constructor(@Attribute('validateDateBirth') public validateDateBirth: number) {
    }

    validate(date: AbstractControl): { [key: string]: any } {
        if (date.value?.length == 8 && moment(date.value, "DDMMYYYY").isValid()) {
            var dateFormated = moment(date.value, "DDMMYYYY").format("YYYY-MM-DD");

            if(moment().diff(dateFormated, 'years') < this.validateDateBirth || moment(dateFormated).diff(moment().format('YYYY-MM-DD'), 'days',false) > 0 || moment(dateFormated) < moment('1800-01-01')){
                return {
                    validateDateBirth: false
                };
            }
        } else{
            return {
                validateDateBirth: false
            };
        }
    }
}