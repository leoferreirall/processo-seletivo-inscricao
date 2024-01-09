import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DocumentoService } from '@services/documento.service';

@Component({
  selector: 'app-termos-condicoes',
  templateUrl: './termos-condicoes.component.html',
  styleUrls: ['./termos-condicoes.component.scss']
})
export class TermosCondicoesComponent implements OnInit {
  @Output() termosaceitos = new EventEmitter<any>();
  @Input() disabled: boolean;

  model: any = {
    aceitenotificacoes: false,
    aceitepoliticas: false
  };

  constructor(
    private serviceDoc: DocumentoService
    ) { }

  ngOnInit(): void {
  }

  getModel(): any {
    return this.model;
  }
  setModel(model: any) {
    this.model = model;
  }

  aceitartermoschecked(e) {
    this.termosaceitos.emit(this.model.aceitepoliticas);
  }

  onClickTermoDeUso(){
    this.ConsultarDocumento(2); //2	- Termo de Uso
  }

  onClickPoliticasPrivacidade(){
    this.ConsultarDocumento(1); //1	- Política de Privacidade
  }

  private ConsultarDocumento(codTipoDoc: number){
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
}
