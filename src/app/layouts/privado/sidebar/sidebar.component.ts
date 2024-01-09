import { Component, OnInit } from '@angular/core';
import { AcessoToscana } from 'src/app/Shared/AcessoToscana';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public acesso: any;

  constructor() { }

  ngOnInit(): void {
    this.acesso = AcessoToscana.verificaAcessoToscana();
  }

}
