import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environments/environment';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { InscricaoService } from '@services/inscricao.service';
import { LancamentoService } from '@services/lancamento.service';
import { PagamentoService } from '@services/pagamento.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { disableDebugTools } from '@angular/platform-browser';
import { AcessoToscana } from 'src/app/Shared/AcessoToscana';


@Component({
  selector: 'app-pagamento-boleto',
  templateUrl: './pagamento-boleto.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./pagamento-boleto.component.scss']
})
export class PagamentoBoletoComponent implements OnInit {
  @Input() idLancamento: number;
  @Output() complete = new EventEmitter<string>();

  @ViewChild('modal') private modalContent: TemplateRef<PagamentoBoletoComponent>;

  modalRef: NgbModalRef;
  //  idLancamento: any;

  boleto: any = {}

  lancamento: any = {};

  public acesso: any;

  constructor(private PagamentoService: PagamentoService,
    private LancamentoService: LancamentoService,
    private NgxSpinnerService: NgxSpinnerService,
    private Router: Router,
    private ActivatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.acesso = AcessoToscana.verificaAcessoToscana();
  }

  async open(idlancamento: number) {
    this.idLancamento = idlancamento;

    this.NgxSpinnerService.show();

    this.PagamentoService.EmitirBoleto(this.idLancamento).subscribe((response: any) => {
      if (response.statusCode == 200) {
        this.boleto = response.result;

        this.modalRef = this.modalService.open(
          this.modalContent,
          {
            size: 'xl',
            scrollable: true,
            //backdrop: 'static',
            keyboard: false
          });

        this.LancamentoService.GetLancamentoById(this.idLancamento).subscribe((response: any) => {
          this.NgxSpinnerService.hide();

          if (response.statusCode == 200) {
            this.lancamento = response.result;

            this.lancamento.valorTotal = this.lancamento.valorPlano - this.lancamento.valorDesconto;

          } else {
            this.toastr.error(response.message);
          }
        });
      } else {
        this.NgxSpinnerService.hide();

        this.toastr.error(response.message);
      }
    });
  }

  async close() {
    this.modalRef.close();
  }

  imprimirBoleto(codPsBoleto: any) {
    this.NgxSpinnerService.show();

    this.PagamentoService.ObterImagemBoleto(codPsBoleto).subscribe(
      (response: any) => {
        this.NgxSpinnerService.hide();

        if (response.statusCode == 200) {
          const fileName = `boleto-fam-${codPsBoleto}.pdf`;
          const base64 = 'data:application/pdf;base64, ' + response.result;

          let file = this.convertBase64ToFile(base64, `boleto-fam-${codPsBoleto}.pdf`);
          saveAs(file, fileName);
        }
        else {
          this.toastr.error(response.message)
        }
      });
  }

  convertBase64ToFile(base64String, fileName) {
    let arr = base64String.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let uint8Array = new Uint8Array(n);
    while (n--) {
      uint8Array[n] = bstr.charCodeAt(n);
    }
    let file = new File([uint8Array], fileName, { type: mime });
    return file;
  }

}
