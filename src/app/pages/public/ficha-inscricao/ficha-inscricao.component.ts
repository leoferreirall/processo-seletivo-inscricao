import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { DocumentoService } from '@services/documento.service';
import { StepModel } from '../../../models/step.model';
import { StepsService } from '../../../services/steps.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { StageEnum } from '../../../models/stage.enum';
import { AcessoToscana } from 'src/app/Shared/AcessoToscana';

@Component({
  selector: 'app-ficha-inscricao',
  templateUrl: './ficha-inscricao.component.html',
  styleUrls: ['./ficha-inscricao.component.scss']
})
export class FichaInscricaoComponent implements OnInit {
  loggedIn: boolean = false;
  public anoAtual: any;
  currentStep: Observable<StepModel>;
  stageEnum = StageEnum;
  isBlackFAMDayBool: boolean;
  ps: any;
  public acesso: any;

  constructor(
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    private service: AuthService,
    private serviceDoc: DocumentoService,
    private StepsService: StepsService
  ) {
    this.anoAtual = new Date().getFullYear();
  }

  ngOnInit(): void {
    this.acesso = AcessoToscana.verificaAcessoToscana();
    this.loggedIn = this.service.loggedIn() ? true : false;
    this.currentStep = this.StepsService.getCurrentStep();
    const hoje = new Date();
    this.isBlackFAMDayBool = ((hoje.getFullYear()*10000) + ((hoje.getMonth()+1)*100) + (hoje.getDate()) >= 20221130) && ((hoje.getFullYear()*10000) + ((hoje.getMonth()+1)*100) + (hoje.getDate()) <= 20230103);
    this.ps = this.ActivatedRoute.snapshot.data["ps"] || null;
  }

  isLogged() {
    return this.service.loggedIn() ? true : false;
  }

  close() {
    var cp = sessionStorage.getObject('cp');

    if (cp) {
      this.router.navigate(['/painel-candidato']);
    } else {
      sessionStorage.clear();
      if (this.acesso) {
        this.router.navigate(['/acessoToscana']);
      } else {
        this.router.navigate(['/painel-do-candidato']);
      }
    }
  }

  onClickTermoDeUso() {
    this.ConsultarDocumento(2); //2	- Termo de Uso
  }

  onClickPoliticasPrivacidade() {
    this.ConsultarDocumento(1); //1	- Política de Privacidade
  }

  private ConsultarDocumento(codTipoDoc: number) {
    this.serviceDoc.ConsultarDocumento(codTipoDoc).subscribe(response => {
      const newBlob = new Blob([(response)], { type: 'application/pdf' });

      // IE doesn't allow using a blob object directly as link href
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
      }

      // For other browsers:
      const downloadURL = URL.createObjectURL(newBlob);
      window.open(downloadURL);
    });
  }

  isBlackFAMDay() {
    var indexBackGroundDiv = document.getElementsByClassName('index-background') as HTMLCollectionOf<HTMLElement>;
    indexBackGroundDiv[0].style["background-color"]="#120624";
    return true;
  }

  isNotBlackFAMDay() {
    var indexBackGroundDiv = document.getElementsByClassName('index-background') as HTMLCollectionOf<HTMLElement>;
    indexBackGroundDiv[0].style["background-color"]="#FF8400";
    return true;
  }
}
