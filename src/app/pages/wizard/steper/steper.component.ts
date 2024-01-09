import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { StepModel } from '../../../models/step.model';
import { StageEnum } from '../../../models/stage.enum';
import { Observable } from 'rxjs';
import { StepsService } from '../../../services/steps.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-steper',
  templateUrl: './steper.component.html',
  styleUrls: ['./steper.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SteperComponent implements OnInit {
  currentStep: Observable<StepModel>;
  stageEnum = StageEnum;

  constructor(
    private StepsService: StepsService,
    private router: Router) { }

  ngOnInit(): void {
    sessionStorage.removeItem('v');

    this.currentStep = this.StepsService.getCurrentStep();
  }

  onNextStep() {
    if (!this.StepsService.isLastStep()) {
      this.StepsService.moveToNextStep();
    } else {
      this.onSubmit();
    }
  }

  showButtonLabel() {
    return !this.StepsService.isLastStep() ? 'Continue' : 'Finish';
  }

  onSubmit(): void {
    this.router.navigate(['/complete']);
  }
}
