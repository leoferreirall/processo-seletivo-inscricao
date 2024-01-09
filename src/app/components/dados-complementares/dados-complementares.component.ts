import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { ListItem } from 'src/app/models/list-item.model';
import { DropDownListComponent } from '../drop-down-list/drop-down-list.component';

declare var moment: any;

@Component({
  selector: 'app-dados-complementares',
  templateUrl: './dados-complementares.component.html',
  styleUrls: ['./dados-complementares.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class DadosComplementaresComponent implements OnInit {
  @ViewChild(DropDownListComponent) dlgenero: DropDownListComponent;
  @Input() disabled: boolean;
  @Output() changeOption = new EventEmitter<boolean>();
  model: any = {};
  generos: Array<ListItem> = [];  

  constructor() {
    this.generos.push({ id: 1, texto: 'Feminino', valor: 'F' });
    this.generos.push({ id: 2, texto: 'Masculino', valor: 'M' });
  }

  ngOnInit(): void {
  }

  onChangeGenero(e) {
    this.model.sexo = e;
  }
  onChangeDeficiencia(e){
   this.changeOption.emit(this.model.possuiDeficiencia);
  }

  getModel(): any {
    this.model.datanascimento = moment(this.model.dataNascimentoSemFormatacao, "DDMMYYYY").format("YYYY-MM-DD");

    return this.model;
  }
  setModel(model: any) {
    if(model.datanascimento){
      model.dataNascimentoSemFormatacao = moment(model.datanascimento).format("DDMMYYYY");
    }

    this.model = model;

    this.dlgenero.setSelected(model.sexo);
  }
}
