import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AcessoToscana } from 'src/app/Shared/AcessoToscana';

@Component({
  selector: 'app-item-menu',
  templateUrl: './item-menu.component.html',
  styleUrls: ['./item-menu.component.scss']
})
export class ItemMenuComponent implements OnInit {
  codPsPessoa: any;
  codPsResponsavel: any;
  public acesso: any;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.codPsPessoa = sessionStorage.getItem('cp');
    this.codPsResponsavel = sessionStorage.getItem('cr');
    this.acesso = AcessoToscana.verificaAcessoToscana();
  }
  public adicionaParemetroCreate(){
    sessionStorage.setItem('createInscricao','true');
    this.router.navigate(['/'])
  }
}
