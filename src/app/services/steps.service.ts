import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EEtapaInscricao } from '../models/etapa-inscricao.enum';
import { StageEnum } from '../models/stage.enum';
import { StatusEnum } from '../models/status.enum';
import { StepModel } from '../models/step.model';
import { TipoRequisitoEnum } from '../models/tipoRequisito.enum';

var steps: any[] = [
  { stepIndex: 1, isComplete: false, stage: StageEnum.Cadastro, stepName: 'Cadastro', stepIcon: 'account_circle', active: true, visible: true },
  { stepIndex: 2, isComplete: false, stage: StageEnum.DadosComplementares, stepName: 'Dados complementares', stepIcon: 'assignment', active: false, visible: true },
  { stepIndex: 10, isComplete: false, stage: StageEnum.Pagamento, stepName: 'Pagamento', stepIcon: 'payment', active: false, visible: true }
];

@Injectable({
  providedIn: 'root'
})
export class StepsService {
  steps$: BehaviorSubject<StepModel[]> = new BehaviorSubject<StepModel[]>(JSON.parse(JSON.stringify(steps)).filter((x: any) => x.visible));
  currentStep$: BehaviorSubject<StepModel> = new BehaviorSubject<StepModel>(null);
  stepscount: number = 3; // default

  fixedStep: StepModel;

  detalheInscricao: any = {};

  constructor() {
    this.currentStep$.next(this.steps$.value.find(x => x.isComplete === false));
  }

  clearSteps() {
    steps.map(x => {
      if (x.stage != StageEnum.Cadastro
        && x.stage != StageEnum.DadosComplementares
        && x.stage != StageEnum.Pagamento) {
        x.visible = false;
      }

      if (x.stage != StageEnum.Cadastro) {
        x.active = false;
      }
    });

    this.steps$ = new BehaviorSubject<StepModel[]>(JSON.parse(JSON.stringify(steps)).filter((x: any) => x.visible));

    this.stepscount = this.steps$.value.length;
  }

  setCurrentStep(step: StepModel): void {
    step.active = true;

    if (!this.fixedStep) {
      this.fixedStep = Object.assign(this.currentStep$.value, {});
    }

    this.currentStep$.next(step);
  }

  changeStep: boolean = false;

  setCurrentStepByStage(stage: StageEnum): void {
    this.changeStep = true;

    this.getSteps().subscribe((steps: any) => {
      const step = steps.find((x: StepModel) => x.stage === stage);
      const fixedStep = steps.find((x: StepModel) => x.stage === this.fixedStep?.stage);

      if (step) {
        step.active = true;

        if (this.changeStep) {
          this.currentStep$.next(step);
          this.changeStep = false;
        }

        steps.map((x: StepModel) => {
          if (steps.indexOf(x) <= steps.indexOf(fixedStep || step)) {
            x.active = true;
          }
        });
      }
    });
  }

  getCurrentStep(): Observable<StepModel> {
    return this.currentStep$.asObservable();
  }

  getCurrentStepObj(): BehaviorSubject<StepModel> {
    return this.currentStep$;
  }

  getListSteps(): BehaviorSubject<StepModel[]> {
    return this.steps$;
  }

  getSteps(): Observable<StepModel[]> {
    return this.steps$.asObservable();
  }

  moveToNextStep(): void {
    window.scrollTo(0, 0);

    this.fixedStep = null;

    const index = this.steps$.value.findIndex(x => x.stage == this.currentStep$.value.stage);

    if (index < this.steps$.value.length) {
      const nextStep = this.steps$.value[index + 1];

      this.setCurrentStepByStage(nextStep.stage);
    }
  }

  isLastStep(): boolean {
    return this.currentStep$.value.stepIndex === this.steps$.value[this.steps$.value.length - 1].stepIndex;
  }

  setVisiblilityByStage(stage: StageEnum, status: boolean) {
    var step = steps.find(x => x.stage == stage);

    step.visible = status;

    this.steps$ = new BehaviorSubject<StepModel[]>(JSON.parse(JSON.stringify(steps)).filter((x: any) => x.visible));

    this.stepscount = this.steps$.value.length;

    this.steps$.next(this.steps$.value);

    this.setCurrentStepByStage(this.currentStep$.value.stage);
  }

  setSequenciaSteps(detalheInscricao: any) {
    steps = [
      { stepIndex: 1, isComplete: false, stage: StageEnum.Cadastro, stepName: 'Cadastro', stepIcon: 'account_circle', active: true, visible: true },
      { stepIndex: 2, isComplete: false, stage: StageEnum.DadosComplementares, stepName: 'Dados complementares', stepIcon: 'assignment', active: false, visible: true }
    ];

    detalheInscricao.requisitos.forEach(requisito => {
      if (requisito.codPsTipoRequisito == TipoRequisitoEnum.Enem) {
        steps.push({ stepIndex: 3, isComplete: false, stage: StageEnum.Enem, stepName: 'ENEM', stepIcon: 'school', active: false, visible: true });

        if (detalheInscricao.possuiTaxaInscricao && detalheInscricao.processoSeletivo == 'MEDICINA') {
          steps.push({ stepIndex: 4, isComplete: false, stage: StageEnum.TaxaInscricao, stepName: 'Taxa de inscrição', stepIcon: 'payment', active: false, visible: true });
        }
      }

      if (detalheInscricao.possuiTaxaInscricao && detalheInscricao.processoSeletivo == 'MEDICINA' && !steps.find(x => x.stage == StageEnum.TaxaInscricao)) {
        steps.push({ stepIndex: 4, isComplete: false, stage: StageEnum.TaxaInscricao, stepName: 'Taxa de inscrição', stepIcon: 'payment', active: false, visible: true });
      }

      if (requisito.codPsTipoRequisito == TipoRequisitoEnum.Avaliacao || requisito.codPsTipoRequisito == TipoRequisitoEnum.AvaliacaoCanvas || requisito.codPsTipoRequisito == TipoRequisitoEnum.AvaliacaoVestibular100) {
        steps.push({ stepIndex: 5, isComplete: false, stage: StageEnum.Avaliacao, stepName: 'Avaliação', stepIcon: 'school', active: false, visible: true });
      }

      if (requisito.codPsTipoRequisito == TipoRequisitoEnum.Documentacao) {
        if (detalheInscricao.idFormaIngresso == 1) {
          steps.push({ stepIndex: 7, isComplete: false, stage: StageEnum.PortadorDiploma, stepName: 'Diplomado', stepIcon: 'list', active: false, visible: true });
        } else if (detalheInscricao.idFormaIngresso == 3) {
          steps.push({ stepIndex: 8, isComplete: false, stage: StageEnum.Transferencia, stepName: 'Transferência', stepIcon: 'list', active: false, visible: true });
        }
      }

      if (requisito.codPsTipoRequisito == TipoRequisitoEnum.DocumentacaoMatricula) {
        steps.push({ stepIndex: 9, isComplete: false, stage: StageEnum.Documentacao, stepName: 'Documentação', stepIcon: 'list', active: false, visible: true });
      }

      if (requisito.codPsTipoRequisito == TipoRequisitoEnum.Historico) {
        steps.push({ stepIndex: 6, isComplete: false, stage: StageEnum.Historico, stepName: 'Histórico', stepIcon: 'list', active: false, visible: true });
      }
    });

    steps.push({ stepIndex: 10, isComplete: false, stage: StageEnum.Pagamento, stepName: 'Pagamento', stepIcon: 'payment', active: false, visible: true });

    this.steps$ = new BehaviorSubject<StepModel[]>(JSON.parse(JSON.stringify(steps)).filter((x: any) => x.visible));

    this.stepscount = this.steps$.value.length;

    this.steps$.next(this.steps$.value);

    this.setCurrentStepByStage(this.currentStep$.value.stage);
  }

  setRequisito(detalheInscricao: any, stage: StageEnum) {
    for (var requisito of detalheInscricao.requisitos) {
      this.detalheInscricao.requisito = requisito;

      if (requisito.codPsTipoRequisito == TipoRequisitoEnum.Enem && stage == StageEnum.Enem) {
        break;
      }

      if ((requisito.codPsTipoRequisito == TipoRequisitoEnum.Avaliacao || requisito.codPsTipoRequisito == TipoRequisitoEnum.AvaliacaoCanvas || requisito.codPsTipoRequisito == TipoRequisitoEnum.AvaliacaoVestibular100) && stage == StageEnum.Avaliacao) {
        break
      }

      if (requisito.codPsTipoRequisito == TipoRequisitoEnum.Documentacao && (stage == StageEnum.PortadorDiploma || stage == StageEnum.Transferencia)) {
        break;
      }

      if (requisito.codPsTipoRequisito == TipoRequisitoEnum.DocumentacaoMatricula && stage == StageEnum.Documentacao) {
        break;
      }

      if (requisito.codPsTipoRequisito == TipoRequisitoEnum.Historico && stage == StageEnum.Historico) {
        break;
      }
    }
  }

  validNextStep(detalheInscricao: any) {
    if (detalheInscricao.etapaInscricao == EEtapaInscricao.AceiteDisponivel ||
      detalheInscricao.etapaInscricao == EEtapaInscricao.ReAceiteDisponivel ||
      detalheInscricao.etapaInscricao == EEtapaInscricao.PendentePagamento ||
      detalheInscricao.etapaInscricao == EEtapaInscricao.PagamentoRecebido ||
      (detalheInscricao.etapaInscricao == EEtapaInscricao.ProcessandoPagamento && detalheInscricao.possuiContrato) ||
      detalheInscricao.possuiAprovacao) {
      this.setCurrentStepByStage(StageEnum.Pagamento);
    } if (detalheInscricao.etapaInscricao == EEtapaInscricao.PreInscricao) {
      this.setCurrentStepByStage(StageEnum.DadosComplementares);
    } else {
      for (var requisito of detalheInscricao.requisitos) {
        this.detalheInscricao.requisito = requisito;

        if (requisito.codPsTipoRequisito == TipoRequisitoEnum.Enem) {
          if (requisito.codPsStatusReq != StatusEnum.Aprovado) {
            this.setCurrentStepByStage(StageEnum.Enem);

            break;
          }

          if (detalheInscricao.possuiTaxaInscricao && detalheInscricao.etapaInscricao == EEtapaInscricao.PendenteTaxaInscricao ||
            (detalheInscricao.etapaInscricao == EEtapaInscricao.ProcessandoPagamento && !detalheInscricao.possuiContrato)) {
            this.setCurrentStepByStage(StageEnum.TaxaInscricao);

            break;
          }
        } else if (detalheInscricao.possuiTaxaInscricao && detalheInscricao.etapaInscricao == EEtapaInscricao.PendenteTaxaInscricao ||
          (detalheInscricao.etapaInscricao == EEtapaInscricao.ProcessandoPagamento && !detalheInscricao.possuiContrato)) {
          this.setCurrentStepByStage(StageEnum.TaxaInscricao);

          break;
        }

        if ((requisito.codPsTipoRequisito == TipoRequisitoEnum.Avaliacao || requisito.codPsTipoRequisito == TipoRequisitoEnum.AvaliacaoCanvas || requisito.codPsTipoRequisito == TipoRequisitoEnum.AvaliacaoVestibular100) && requisito.codPsStatusReq != StatusEnum.Aprovado) {
          this.setCurrentStepByStage(StageEnum.Avaliacao);

          break;
        }

        if (requisito.codPsTipoRequisito == TipoRequisitoEnum.Documentacao && requisito.codPsStatusReq != StatusEnum.Aprovado) {
          if (detalheInscricao.idFormaIngresso == 1) {
            this.setCurrentStepByStage(StageEnum.PortadorDiploma);
          } else if (detalheInscricao.idFormaIngresso == 3) {
            this.setCurrentStepByStage(StageEnum.Transferencia);
          }

          break;
        }

        if (requisito.codPsTipoRequisito == TipoRequisitoEnum.DocumentacaoMatricula && requisito.codPsStatusReq != StatusEnum.Aprovado) {
          this.setCurrentStepByStage(StageEnum.Documentacao);

          break;
        }

        if (requisito.codPsTipoRequisito == TipoRequisitoEnum.Historico && requisito.codPsStatusReq != StatusEnum.Aprovado) {
          this.setCurrentStepByStage(StageEnum.Historico);

          break;
        }
      }
    }
  }
}
