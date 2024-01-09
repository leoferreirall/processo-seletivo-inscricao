import { Component } from '@angular/core';
import { AcessoToscana } from './Shared/AcessoToscana';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'psel-painel-candidato';

  constructor(){
  }
  ngOnInit(): void {

  }

  private corBody()
  {
    if(AcessoToscana.verificaAcessoToscana()){
      document.querySelectorAll('body').item(0).style.backgroundColor = 'gray';
    }
  }
}
