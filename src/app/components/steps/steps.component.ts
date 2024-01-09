import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { StepModel } from 'src/app/models/step.model';
import { StepsService } from 'src/app/services/steps.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StepsComponent implements OnInit {

  steps: Observable<StepModel[]>;
  currentStep: Observable<StepModel>;
  currentStepObj: BehaviorSubject<StepModel>;  

  progress: any = 0;

  constructor(public StepsService: StepsService) { }

  ngOnInit(): void {
    this.currentStep = this.StepsService.getCurrentStep();
    this.currentStepObj = this.StepsService.getCurrentStepObj();
  }

  getSteps(){
    return this.StepsService.getSteps();
  }

  onStepClick(step: StepModel) {
      sessionStorage.setObject('v', true);
      
      this.StepsService.setCurrentStep(step);
  }

  calcProgress(){
    var currentStep = this.StepsService.getCurrentStepObj();
    var listSteps = this.StepsService.getListSteps();

    var i = listSteps.value.indexOf(currentStep.value);

    return (100/(listSteps.value.length*2)) + ((100/listSteps.value.length)*(this.StepsService.isLastStep() ? (i + 1) : i));
  }
}