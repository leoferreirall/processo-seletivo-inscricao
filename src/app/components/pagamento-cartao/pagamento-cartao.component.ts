import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environments/environment';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LancamentoService } from '@services/lancamento.service';
import { PagamentoService } from '@services/pagamento.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AcessoToscana } from 'src/app/Shared/AcessoToscana';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pagamento-cartao',
  templateUrl: './pagamento-cartao.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./pagamento-cartao.component.scss']
})
export class PagamentoCartaoComponent implements OnInit {
  @Input() idLancamento: number;
  @Output() complete = new EventEmitter<string>();

  @ViewChild('modal') private modalContent: TemplateRef<PagamentoCartaoComponent>;
  @ViewChild('form') form: NgForm;

  modalRef: NgbModalRef;
  //  idLancamento: any;

  cartao: any = {}

  lancamento: any = {};
  listaParcelas: any = [];
  mensagem: any;
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

    this.cartao = {
      nome: null,
      numeroCartao: null,
      validade: null,
      cvv: null,
      qtdParcelas: 1,
      tipoCartao: 2
    }

    this.modalRef = this.modalService.open(
      this.modalContent,
      {
        size: 'xl',
        scrollable: false,
        //backdrop: 'static',
        keyboard: false
      });

    this.CarregarInfo();
  }

  async close() {
    this.modalRef.close();
  }

  CarregarInfo(): void {
    this.modalContent.elementRef.nativeElement.ownerDocument.form.reset();

    if (this.idLancamento) {

      this.NgxSpinnerService.show();

      this.LancamentoService.GetLancamentoById(this.idLancamento).subscribe((response: any) => {
        this.NgxSpinnerService.hide();

        if (response.statusCode == 200) {
          this.lancamento = response.result;

          this.lancamento.valorTotal = this.lancamento.valorPlano - this.lancamento.valorDesconto;

          var qtdParcelas = parseInt((this.lancamento.valorTotal / environment.pagamento.valorMinParcela).toString()) || 1;

          qtdParcelas = qtdParcelas > environment.pagamento.qtdMaxParcelas ? environment.pagamento.qtdMaxParcelas : qtdParcelas;

          this.listaParcelas = [];

          for (var i = 0; i < qtdParcelas; i++) {
            this.listaParcelas.push(this.lancamento.valorTotal / (i + 1));
          }

        } else {
          this.toastr.error(response.message);
        }
      });
    }
  }

  onChangeTipoCartao() {
    this.cartao.qtdParcelas = 1;
  }

  onSubmitFormPagamento(cartao: any) {
    if (!cartao.nome) {
      this.toastr.warning("Favor informar o nome");
    } else if (!cartao.numeroCartao) {
      this.toastr.warning("Favor informar o npumero do cartão");
    } else if (!cartao.validade) {
      this.toastr.warning("Favor informar a validade");
    } else if (!cartao.cvv) {
      this.toastr.warning("Favor informar o código de segurança");
    } else if (!cartao.qtdParcelas) {
      this.toastr.warning("Favor selecionar a quantidade de parcelas");
    } else if (!cartao.tipoCartao) {
      this.toastr.warning("Favor informar o tipo de cartão");
    } else {
      this.NgxSpinnerService.show();

      this.PagamentoService.RealizarPagamento(this.idLancamento, cartao).subscribe((response: any) => {
        this.NgxSpinnerService.hide();

        if (response.statusCode === 200) {

          this.sucesso();
        } else if (response.statusCode == 404) {
          this.mensagem = response.message;

          this.sucesso();
        } else {
          this.erro(response.message);
        }
      },
        error => {
          this.toastr.clear();

          this.erro("Ocorreu um erro inesperado, favor tentar novamente");
        });
    }
  }

  sucesso() {
    Swal.fire({
      title: '<strong style="color:#ff5c00">Pagamento realizado com sucesso!</strong>',
      text: 'Já estamos preparando seu acesso à FAM.',
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: 'Continuar',
      confirmButtonColor: '#ff5c00'
    }).then((result) => {
      this.modalService.dismissAll();

      this.complete.emit('');
    });
  }

  erro(mensagem) {
    Swal.fire({
      title: '<strong style="color:#ff5c00">Erro ao realizar pagamento</strong>',
      text: mensagem,
      icon: 'error',
      showCancelButton: false,
      confirmButtonText: 'Fechar',
      confirmButtonColor: '#ff5c00'
    }).then((result) => {

    });
  }

  info() {
    Swal.fire({
      title: '<strong style="color:#ff5c00">Você possui uma transação em andamento</strong>',
      text: 'Por favor volte aqui novamente em alguns minutos',
      icon: 'info',
      showCancelButton: false,
      confirmButtonText: 'Fechar',
      confirmButtonColor: '#ff5c00'
    }).then((result) => {

    });
  }

  infoReload(message) {
    Swal.fire({
      title: '<strong style="color:#ff5c00">Pagamento não foi concluido</strong>',
      text: message,
      icon: 'info',
      showCancelButton: false,
      confirmButtonText: 'Fechar',
      confirmButtonColor: '#ff5c00'
    }).then((result) => {
      window.location.reload();
    });
  }
}
