import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConveniosComponent } from '../convenios/convenios.component';
import { ExtratoCampanhaComponent } from '../extrato-campanha/extrato-campanha.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-planos-condicoes',
  templateUrl: './planos-condicoes.component.html',
  styleUrls: ['./planos-condicoes.component.scss']
})
export class PlanosCondicoesComponent implements OnInit {
  @ViewChild(ConveniosComponent) convenios: ConveniosComponent;
  @ViewChild(ExtratoCampanhaComponent, { static: true }) campanhas: ExtratoCampanhaComponent;
  @Input() uidl: number = null;
  @Input() uidi: number = null;
  @Input() codbolsa: string = null;
  @Input() showConvenios: boolean = true;
  @Input() showPlano: boolean = true;
  @Input() loadOnInit: boolean = true;
  @Input() disabled: boolean;

  constructor() { }

  ngOnInit(): void {

  }

  getConvenio(): string {
    return this.convenios?.convenioSelecionado;
  }

  setConvenio(e) {
    this.convenios.setConvenio(e);
    this.campanhas.onChangeConvenio(e);
  }

  onChangeConvenio(e) {
    this.campanhas.onChangeConvenio(e);
  }
}
