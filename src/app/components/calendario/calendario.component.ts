import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent implements OnInit {
  @Input() show: boolean = false;
  @Output() selectChange = new EventEmitter<any>();
  //visible: boolean = false;

  constructor() { }

  ngOnInit(): void {

  }

  onChange(e) {
    this.selectChange.emit(e);
  }
}
