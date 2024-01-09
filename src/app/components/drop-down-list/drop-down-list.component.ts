import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { ListItem } from 'src/app/models/list-item.model';

@Component({
  selector: 'app-drop-down-list',
  templateUrl: './drop-down-list.component.html',
  styleUrls: ['./drop-down-list.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class DropDownListComponent implements OnInit {
  @Input() itens: Array<ListItem>[] = [];
  @Input() title: string;
  @Input() defaultvalue: string;
  @Input() show: boolean = true;
  @Input() presetvalue: any = null;
  @Input() name: string = null;
  @Input() required: boolean;
  @Input() disabled: boolean;
  @Output() selectChange = new EventEmitter<any>();

  valorselecionado: any;// = this.presetvalue;

  teste: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  onChange(e) {
    this.selectChange.emit(this.valorselecionado);
  }

  setSelected(value: any) {
    this.valorselecionado = value;
  }
}
