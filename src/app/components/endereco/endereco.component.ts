import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { CandidatoService } from '@services/candidato.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Response } from 'src/app/models/response.model';

declare var $: any;

@Component({
  selector: 'app-endereco',
  templateUrl: './endereco.component.html',
  styleUrls: ['./endereco.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class EnderecoComponent implements OnInit {  

  @ViewChild('numero') numero: ElementRef;

  @Input() disabled: boolean;

  @Input() cep: string;
  @Output() changeendereco = new EventEmitter<any>();
  // istaEndereco: any = [];

  exists: boolean = false;
  endereco: any = { cep: '' };
  constructor(
    private service: CandidatoService,
    private toastr: ToastrService,
    private NgxSpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {

  }

  getModel(): any {
    return this.endereco;
  }

  setModel(model: any) {
    this.endereco = model;
    this.exists = true;
  }

  selecionarEndereco(endereco: any) {
    // this.listaEndereco.forEach(item => {
    //   item.selected = false;
    // });

    //endereco.selected = true;

    this.endereco = Object.assign({}, endereco);

    this.endereco.codPsPessoa = Number(sessionStorage.getItem('codPsPessoa'));
    this.endereco.status = true;
    this.endereco.utmSource = "";
    this.endereco.utmCampaign = "";
    this.endereco.latitude = 0;
    this.endereco.longitude = 0;
    this.endereco.aceiteNotificacoes = true;
    this.endereco.dtAceiteNotificacoes = new Date().toISOString().substring(0, 10);

    $("label[for='cep']").addClass('active');
    $("label[for='logradouro']").addClass('active');
  }

  getEndereco(cep: string) {
    //this.listaEndereco = [];

    this.endereco.logradouro = null;
    //this.endereco.selected = false;

    if (cep.length < 8) {
      return;
    }

    this.NgxSpinnerService.show();
    this.service.ConsultarEnderecoPorCep(cep.replace('-', '')).subscribe((response: Response) => {
      this.NgxSpinnerService.hide();
      
      if (response.statusCode == 200) {

        if (response.result.length > 0) {
          this.selecionarEndereco(response.result[0]);

          this.exists = true;
          this.changeendereco.emit(response.result[0]);

          this.numero.nativeElement.focus();
        }
        else {
          this.endereco = {};
          this.exists = false;
          this.toastr.warning("CEP não localizado. Em caso de CEP de cidade, por favor, informar o CEP da agência dos correios da cidade.");
        }
        // if (response.result.length == 1) {
        //   this.selecionarEndereco(response.result[0]);
        // }

        //this.listaEndereco = response.result || [];

      } else {
        this.toastr.warning("CEP não localizado");
      }
    });
  }

  getEnderecoRua(rua: string) {
    //this.listaEndereco = [];

    this.endereco.cep = null;
    //this.endereco.selected = false;

    if (rua.length < 3) {
      return;
    }

    this.NgxSpinnerService.show();

    this.service.ConsultarEnderecoPorRua(rua).subscribe((response: any) => {
      this.NgxSpinnerService.hide();

      if (response.statusCode == 200 && response.result && response.result.length > 0) {
        if (response.result.length == 1) {
          this.selecionarEndereco(response.result[0]);
        }

        //this.listaEndereco = response.result || [];

      } else {
        this.toastr.warning("Rua não localizada");
      }
    });
  }
}
