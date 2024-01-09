import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-deficiencia',
  templateUrl: './deficiencia.component.html',
  styleUrls: ['./deficiencia.component.scss']
})
export class DeficienciaComponent implements OnInit {
  @Input() disabled: boolean;
  
  model: any = {};
  possuiDeficiencia: boolean = false;  

  constructor() { }

  ngOnInit(): void {
  }

  getModel(): any {
    return this.model;
  }
  setModel(model: any) {    
    this.model = model;

    this.model.deficienteAuditivo = this.model.deficienteAuditivo || false;
    this.model.deficienteFala = this.model.deficienteFala || false;
    this.model.deficienteFisico = this.model.deficienteFisico || false;
    this.model.deficienteIntelectual = this.model.deficienteIntelectual || false;
    this.model.deficienteMental = this.model.deficienteMental || false;
    this.model.deficienteMobReduzida = this.model.deficienteMobReduzida || false;
    this.model.deficienteVisual = this.model.deficienteVisual || false;
    this.model.deficienteObservacao = this.model.deficienteObservacao || null;
    
    if (this.model.deficienteAuditivo ||
      this.model.deficienteFala ||
      this.model.deficienteFisico ||
      this.model.deficienteIntelectual ||
      this.model.deficienteMental ||
      this.model.deficienteMobReduzida ||
      this.model.deficienteVisual ||
      this.model.deficienteObservacao) {
      this.possuiDeficiencia = true;
    } else {
      this.possuiDeficiencia = false;
    }
  }

  validar() {
    if (this.possuiDeficiencia) {
      if (!(this.model.deficienteAuditivo ||
        this.model.deficienteFala ||
        this.model.deficienteFisico ||
        this.model.deficienteIntelectual ||
        this.model.deficienteMental ||
        this.model.deficienteMobReduzida ||
        this.model.deficienteVisual ||
        this.model.deficienteObservacao)) {

        return false;
      } else {
        return true;
      }
    } else {
      this.model.deficienteAuditivo = false;
      this.model.deficienteFala = false;
      this.model.deficienteFisico = false;
      this.model.deficienteIntelectual = false;
      this.model.deficienteMental = false;
      this.model.deficienteMobReduzida = false;
      this.model.deficienteVisual = false;
      this.model.deficienteObservacao = null;

      return true;
    }
  }
  setShow(show: boolean) {
    if (show === false)
      this.model = {};
    this.possuiDeficiencia = show;
  }
}
