import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { PainelCandidatoRoutingModule } from './painel-candidato.routing';

import { PainelCandidatoComponent } from './painel-candidato.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TooltipModule } from 'ng2-tooltip-directive';
import { HomeComponent } from 'src/app/pages/private/home/home.component';
import { MinhasInscricoesComponent } from 'src/app/pages/private/inscricoes/minhas-inscricoes/minhas-inscricoes.component';
import { AlterarSenhaComponent } from 'src/app/pages/private/alterar-senha/alterar-senha.component';

const maskConfig: Partial<IConfig> = {
    validation: true
};

export const customCurrencyMaskConfig = {
    align: "right",
    allowNegative: true,
    allowZero: true,
    decimal: ",",
    precision: 2,
    prefix: "R$ ",
    suffix: "",
    thousands: ".",
    nullable: true
};

@NgModule({
    imports: [
        CommonModule,
        PainelCandidatoRoutingModule,
        FormsModule,
        TooltipModule,
        NgxSpinnerModule,
        NgxMaskModule.forRoot(maskConfig),
        NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
    ],
    declarations: [
        PainelCandidatoComponent,
        HomeComponent,
        MinhasInscricoesComponent,
        AlterarSenhaComponent
    ],
    providers: [{
        provide: LOCALE_ID,
        useValue: 'pt-BR' // 'de' for Germany, 'fr' for France ...
    }]
})
export class PainelCandidatoModule { }
