import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var App: any;

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(private Router: Router) {
  }

  ngOnInit(): void {
    App.initMainPage();

    /*if(this.Router.url == '/administrativo'){
      this.Router.navigate(['administrativo/dashboard']);
    }*/
  }
}