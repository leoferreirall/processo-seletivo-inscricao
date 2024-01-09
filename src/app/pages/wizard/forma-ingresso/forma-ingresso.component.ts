import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
import { InscricaoService } from '@services/inscricao.service';
import { StepsService } from '@services/steps.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { EnemComponent } from 'src/app/components/enem/enem.component';
import { Response } from 'src/app/models/response.model';
import { StageEnum } from 'src/app/models/stage.enum';
import { StepModel } from 'src/app/models/step.model';

@Component({
  selector: 'app-forma-ingresso',
  templateUrl: './forma-ingresso.component.html',
  styleUrls: ['./forma-ingresso.component.scss']
})
export class FormaIngressoComponent implements OnInit {
  @ViewChild(EnemComponent) enem: EnemComponent;

  loggedIn: boolean = false;
  uidl: number = null;
  uidi: number = null;
  cp: number = null;
  detalheInscricao: any = {};
  carregando: boolean = true;
  currentStep: Observable<StepModel>;
  stageEnum = StageEnum;

  constructor(
    private inscService: InscricaoService,
    private StepsService: StepsService,
    private authService: AuthService,
    private NgxSpinnerService: NgxSpinnerService,
    private toastr: ToastrService) { }

  permiteavancaretapa: boolean = false;

  ngOnInit() {
    this.currentStep = this.StepsService.getCurrentStep();

    this.loggedIn = this.authService.loggedIn() ? true : false;
    this.uidl = sessionStorage.getObject('uidl');
    this.uidi = sessionStorage.getObject('uidi');
    this.cp = sessionStorage.getObject('cp');

    this.ConsultarInscricao(() => {
      this.carregando = false;
      this.NgxSpinnerService.hide();
    });
  }

  ConsultarInscricao(callback: any) {
    this.NgxSpinnerService.show();
    this.inscService.ConsultarDetalheInscricao(this.uidi, this.cp)
      .subscribe((response: Response) => {
        if (response.statusCode === 200) {
          this.detalheInscricao = response.result;

          var step = this.StepsService.getCurrentStepObj();

          this.StepsService.setRequisito(response.result, step.value.stage);

          this.detalheInscricao.requisito = this.StepsService.detalheInscricao.requisito;
          this.detalheInscricao.codPsReqAnalise = this.StepsService.detalheInscricao.requisito.codPsReq;
          this.detalheInscricao.statusAnalise = this.StepsService.detalheInscricao.requisito.codPsStatusReq;

          this.permiteavancaretapa = false;

          var v = sessionStorage.getObject('v');

          this.permiteavancaretapa = !v && this.detalheInscricao.possuiAprovacao;

          if (!v) {
            this.StepsService.validNextStep(response.result);
          }

          if (!v && this.detalheInscricao.possuiAprovacao) {
            this.StepsService.setCurrentStepByStage(StageEnum.Pagamento);

            this.NgxSpinnerService.hide();
          } else {
            callback();
          }
        }
        else if (response.statusCode === 404) {
          this.toastr.warning(response.message);

          callback();
        }
        else if (response.statusCode === 400) {
          this.toastr.error(response.message);

          callback();
        }
      });
  }

  next() {
    sessionStorage.setObject('v', true);

    this.StepsService.moveToNextStep();
  }

  onComplete() {
    sessionStorage.removeItem('v');

    this.ConsultarInscricao(() => { this.NgxSpinnerService.hide(); });
  }
}
