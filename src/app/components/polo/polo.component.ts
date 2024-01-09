import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EventEmitterService } from '@services/event-emitter.service';
import { InscricaoService } from '@services/inscricao.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Acoes } from 'src/app/models/acoes.enum';
import { Filtro } from 'src/app/models/filtro.model';
import { ListItem } from 'src/app/models/list-item.model';
import { Response } from 'src/app/models/response.model';
import { DropDownListComponent } from '../drop-down-list/drop-down-list.component';

@Component({
  selector: 'app-polo',
  templateUrl: './polo.component.html',
  styleUrls: ['./polo.component.scss']
})
export class PoloComponent implements OnInit {
  @Output() selectedPolo = new EventEmitter<any>();
  @Input() show: boolean = true;
  @Input() disabled: boolean;

  @ViewChild('estado') estado: DropDownListComponent;
  @ViewChild('cidade') cidade: DropDownListComponent;
  @ViewChild('polo') polo: DropDownListComponent;

  polos: Array<ListItem> = [];
  estados: Array<ListItem> = [];
  cidades: Array<ListItem> = [];

  estadoselecionado: string = null;
  cidadeselecionada: string = null;
  poloselecionado: any = null;

  filtro: Filtro = null;

  enderecopolo: string;

  model: any = {};

  private subestpolo: any;
  private subcidpolo: any;
  private subpolo: any;

  constructor(
    private service: InscricaoService) { 
      this.estado = this.estado || new DropDownListComponent();
      this.cidade = this.cidade || new DropDownListComponent();
      this.polo = this.polo || new DropDownListComponent();
    }

  ngOnInit(): void {
  }

  setModel(model: any) {
    this.model = model;
  }

  clearModel(){
    this.model = null;
  }

  CarregarEstadosPolo(filtro: Filtro) {

    this.filtro = filtro;
    this.CarregarEstados();
  }

  onChangeEstado(selecionado: any) {
    this.ResetarCombos(Acoes.EstadoPolo);
    if (selecionado) {
      this.estadoselecionado = selecionado;
      this.CarregarCidades();
    }
  }
  onChangeCidade(selecionado: any) {
    this.ResetarCombos(Acoes.CidadePolo);
    if (selecionado) {
      this.cidadeselecionada = selecionado;
      this.CarregarPolos();
    }
  }

  onChangePolo(selecionado: any) {
    this.ResetarCombos(Acoes.Polo);

    if (selecionado) {
      this.poloselecionado = selecionado;
      this.poloselecionado.ufcampus = this.estadoselecionado;
      this.poloselecionado.cidadecampus = this.cidadeselecionada;      
      this.enderecopolo = `${this.poloselecionado.endereco} - ${this.poloselecionado.bairro} - ${this.poloselecionado.cidade} - ${this.poloselecionado.estado}`;

      this.selectedPolo.emit(this.poloselecionado);
    }
  }
  
  CarregarEstados() {
    this.ExibirCarregando('estados', 'estado');
    this.service.ConsultarEstadosPolo(this.filtro)
      .subscribe((response: Response) => {
        if (response.statusCode === 200 && response.result !== null && response.result.length > 0) {
          this.estados = [];
          this.ExibirSelecione('estados', 'estado');
          this.estados.push(...response.result.map((item) => {
            return {
              id: item.uf,
              texto: item.nome,
              valor: item.uf,
              selected: false,
              disabled: false
            };
          }));

          var ufCampus;

          if (this.model?.ufCampus) {
            ufCampus = this.model.ufCampus;
          } else if(response.result.length == 1){
            ufCampus = response.result[0].uf;
          }

          if (ufCampus) {
            this.estado.setSelected(ufCampus);
            this.onChangeEstado(ufCampus);
          }
        }
      }, (err: HttpErrorResponse) => {

      });
  }

  CarregarCidades() {
    this.ExibirCarregando('cidades', 'cidade');
    this.service.ConsultarCidadesPolo(
      this.estadoselecionado,
      this.filtro)
      .subscribe((response: Response) => {
        if (response.statusCode === 200 && response.result !== null && response.result.length > 0) {
          this.cidades = [];
          this.ExibirSelecione('cidades', 'cidade');
          this.cidades.push(...response.result.map((item) => {
            return {
              id: item.codMunicipio,
              texto: item.nome,
              valor: item.codMunicipio,
              selected: false,
              disabled: false
            };
          }));

          var cidadeCampus;

          if (this.model?.cidadeCampus) {
            cidadeCampus = this.model.cidadeCampus;
          } else if(response.result.length == 1){
            cidadeCampus = response.result[0].codMunicipio;
          }

          if (cidadeCampus) {
            this.cidade.setSelected(cidadeCampus);
            this.onChangeCidade(cidadeCampus);
          }
        }
      }, (err: HttpErrorResponse) => {

      });
  }

  CarregarPolos() {
    this.ExibirCarregando('polos', 'polo');
    this.service.ConsultarPolos(
      this.estadoselecionado,
      this.cidadeselecionada,
      this.filtro)
      .subscribe((response: Response) => {
        if (response.statusCode === 200 && response.result !== null && response.result.length > 0) {
          this.polos = [];
          this.ExibirSelecione('polos', 'polo');
          this.polos.push(...response.result.map((item) => {
            return {
              id: item.codigo,
              texto: item.nome,
              valor: item,
              selected: false,
              disabled: false
            };
          }));

          var codCampus;

          if (this.model?.codCampus) {
            codCampus = this.model.codCampus;
          } else if(response.result.length == 1){
            codCampus = response.result[0].codigo;
          }

          if(codCampus){
            var poloselecionado = response.result.find((x: any) => x.codigo == codCampus);

            if (poloselecionado) {
              this.polo.setSelected(poloselecionado);
              this.onChangePolo(poloselecionado);

              this.clearModel();
            }
          }
        }
      }, (err: HttpErrorResponse) => {

      });
  }
 
  ResetarCombos(acao: Acoes): any {
    switch (acao) {
        case Acoes.FormaIngresso:        
          this.estados = [];
        case Acoes.EstadoPolo:
          this.cidades = [];

          this.estadoselecionado = null;
        case Acoes.CidadePolo:
          this.polos = [];

          this.cidadeselecionada = null;

          this.selectedPolo.emit(null);
        case Acoes.Polo:
          this.poloselecionado = null;
    }
  }

  private ExibirCarregando(nameList: string, element: string) {
    this[nameList] = [{ id: '', texto: 'Carregando...', valor: '', selected: true, disabled: true }];

    this[element]?.setSelected('');
  }
  private ExibirSelecione(nameList: string, element: string) {
    this[nameList] = [{ id: '', texto: 'Selecione uma opção...', valor: '', selected: true, disabled: false }];

    this[element]?.setSelected('');
  }
}

// interface Response {
//   statusCode: number;
//   result: any;
//   message: string;
// }
// interface ListItem {
//   texto: string;
//   id: string;
//   valor: object;
//   selected: boolean;
//   disabled: boolean;
// }