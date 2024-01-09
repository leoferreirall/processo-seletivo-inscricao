import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ContratoService } from '@services/contrato.service';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Response } from 'src/app/models/response.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AcessoToscana } from 'src/app/Shared/AcessoToscana';

@Component({
  selector: 'app-contrato',
  templateUrl: './contrato.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./contrato.component.scss']
})
export class ContratoComponent implements OnInit {
  @Input() uidi: number;
  @Input() show: boolean = false;
  @Input() codBolsa: number = null;

  @ViewChild('modal') private modalContent: TemplateRef<ContratoComponent>;
  @Output() complete = new EventEmitter<string>();
  aceitecontrato: boolean = false;
  contrato: Documento = null;
  modalRef: NgbModalRef;
  carregando: boolean = true;
  public acesso: any;


  msgcarregando: string;

  constructor(
    private serviceContrato: ContratoService,
    public activeModal: NgbActiveModal,
    public NgxSpinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    //this.ConsultarContrato(() => { });
    this.acesso = AcessoToscana.verificaAcessoToscana();
  }

  async open() {
    this.modalRef = this.modalService.open(
      this.modalContent,
      {
        size: 'xl',
        scrollable: true,
        //backdrop: 'static',
        keyboard: false
      });

    const msgs = ['Estamos preparando seu contrato...', 'Isso pode demorar alguns minutos...', 'Estamos quase lá...'];
    var imgs = 0;
    this.msgcarregando = 'Estamos preparando seu contrato...';

    var node = setInterval(() => {
      if (imgs === 3) { return; }

      this.msgcarregando = msgs[imgs];
      imgs++;
    }, 6000);

    this.ConsultarContrato(() => {
      clearInterval(node);
    });
  }

  async close() {
    this.modalRef.close();
  }

  ConsultarContrato(callback: any) {
    var codPsUsuario = sessionStorage.getObject('user').codPsUsuario;

    this.serviceContrato.ConsultarContrato(this.uidi, this.codBolsa, codPsUsuario).subscribe((response: Response) => {
      if (response.statusCode === 200) {
        if (response.result) {
          this.contrato = response.result;
          this.carregando = false;
        } else {
          this.msgcarregando = 'Contrato insdiponível no momento! Por favor, tente novamente em instantes.';
        }
        callback();
      }
      // else {
      //   callback();
      // }
    }, (err: HttpErrorResponse) => {
      callback();
    });
  }


  onClickAceitarContrato() {
    this.NgxSpinnerService.show('contrato');

    this.serviceContrato.AceitarContrato(this.uidi, this.contrato.codPsAceiteDoc, this.contrato.codPsDoc)
      .subscribe((response: any) => {
        if (response.statusCode == 200) {
          this.modalRef.close();
          this.complete.emit();
        } else
        {
          this.toastr.warning(response.message);
        } 
      }, (err: HttpErrorResponse) => {
        this.NgxSpinnerService.hide('contrato');
      },
        () => {
          this.NgxSpinnerService.hide('contrato');
        });
  }
}
interface Documento {
  codPsDoc?: number;
  codPsAceiteDoc: number;
  documento: string;
}
