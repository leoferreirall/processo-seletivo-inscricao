import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-processo-seletivo',
  templateUrl: './processo-seletivo.component.html',
  styleUrls: ['./processo-seletivo.component.scss']
})
export class ProcessoSeletivoComponent implements OnInit, AfterViewInit {
  @Output() selectChange = new EventEmitter<any>();

  procsel: any;

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit() {
    // this.elementRef.nativeElement.querySelector('#procsel')
    //   .addEventListener('change', this.onChange.bind(this));
  }

  ngOnInit(): void {
  }

  onChange(e) {    
    this.selectChange.emit(e);
  }
  setSelectedItem(e){

  }
}
