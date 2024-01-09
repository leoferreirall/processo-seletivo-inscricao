import { StageEnum } from './stage.enum';

export interface StepModel {
    stepIndex: number;
    isComplete: boolean;
    stage: StageEnum;
    stepIcon: string;
    stepName: string;
    active: boolean;
    visible: boolean;
}