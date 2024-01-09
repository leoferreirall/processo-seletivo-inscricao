import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth/auth.service';
import { AcessoToscana } from 'src/app/Shared/AcessoToscana';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  user: string = "";
  public acesso: any;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.acesso = AcessoToscana.verificaAcessoToscana();
  }

}
