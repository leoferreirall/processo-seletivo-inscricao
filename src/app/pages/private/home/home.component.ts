import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CandidatoService } from 'src/app/services/candidato.service';
import { menuItems } from '../menu';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title = 'Home';
  public _menuItems = menuItems;

  constructor() {

  }
  ngOnInit() {

  }
  ngAfterViewInit(): void {
    var indexBackGroundDiv = document.getElementsByClassName('index-background') as HTMLCollectionOf<HTMLElement>;
    indexBackGroundDiv[0].style["background-color"]="#FF8400";
  }
}
