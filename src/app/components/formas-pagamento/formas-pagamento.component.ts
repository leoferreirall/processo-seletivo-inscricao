import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-formas-pagamento',
  templateUrl: './formas-pagamento.component.html',
  styleUrls: ['./formas-pagamento.component.scss']
})
export class FormasPagamentoComponent implements OnInit {
  @Input() show: boolean = true;
  @Input('formaPagamento') formaPagamento: number = 1;

  constructor() { }

  ngOnInit(): void {
  }

}
