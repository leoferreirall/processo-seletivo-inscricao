import { Component, OnInit } from '@angular/core';
import { StepsService } from '@services/steps.service';
import { StageEnum } from 'src/app/models/stage.enum';
import { StepModel } from 'src/app/models/step.model';

declare var $: any;

@Component({
    selector: 'app-painel-candidato',
    template: '<router-outlet></router-outlet><router-outlet name="pagamento"></router-outlet>'
})
export class PainelCandidatoComponent implements OnInit {
    constructor(private StepsService: StepsService) { }

    ngOnInit() {
        $('body').removeClass('sidebar-open');
        $('body').addClass('sidebar-closed sidebar-collapse');

        sessionStorage.setObject('uidi', null);
        sessionStorage.setObject('uidl', null);
        sessionStorage.setObject('n.i', true);
        sessionStorage.setObject('i.e', true);
        sessionStorage.setObject('v', false);
        
        this.StepsService.clearSteps();
        this.StepsService.setCurrentStepByStage(StageEnum.Cadastro);
     }
}
