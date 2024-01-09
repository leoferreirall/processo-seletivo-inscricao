import { Component, Input, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { ContratoService } from '@services/contrato.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { StepsService } from '@services/steps.service';
import { StageEnum } from 'src/app/models/stage.enum';

@Component({
  selector: 'app-extrato-pagamento',
  templateUrl: './extrato-pagamento.component.html',
  styleUrls: ['./extrato-pagamento.component.scss']
})
export class ExtratoPagamentoComponent implements OnInit {
  @Input('extrato') extrato: any = null;
  @Input() codPsInscricao: number;
  @Input() codBolsa: any = null;

  private stepModel = StageEnum;
  public taxaInscricao: any;
  private contrato: any;
  valorMinParcela: number;

  constructor(
    private spinner: NgxSpinnerService,
    private contratoService: ContratoService,
    private toaster: ToastrService,
    private stepsService: StepsService) { }

  ngOnInit(): void {
    this.valorMinParcela = environment.pagamento.valorMinParcela;
    this.etapaInscricao();
  }

  public InscricaoIfood() {
    return this.codBolsa == '266'
  }

  public etapaInscricao() {
    this.stepsService.getCurrentStep().subscribe(
      (resp: any) => {
        this.taxaInscricao = (this.stepModel.TaxaInscricao == resp.stage);
      },
    );
  }
  public downloadContratoAceito() {
    this.PegarContrato();
    saveAs(this.contrato);
  }

  private PegarContrato() {
    this.spinner.show();
    this.contratoService.PegarContratoAceitoSalvo(this.codPsInscricao).subscribe(
      (resp: any) => {
        this.contrato = resp
      },
      (error: Error) => {
        console.error(error.message);
        this.toaster.error("Algo deu errado!");
      },
      () => {
        this.spinner.hide();
      }
    );
  }


}
