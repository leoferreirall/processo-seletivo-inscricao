import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './services/auth/auth.service';
import { TokenInterceptorService } from './services/token/token-interceptor.service';
import { AuthGuard } from './auth.guard';
import { FormsModule } from '@angular/forms';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { NgxCurrencyModule } from "ngx-currency";
import { BaseComponent } from './components/base.component';
import { PrimeiroAcessoLayoutComponent } from 'src/app/layouts/publico/primeiro-acesso-layout.component';
import { LayoutComponent } from 'src/app/layouts/privado/layout.component';
import { NavbarComponent } from 'src/app/layouts/privado/navbar/navbar.component';
import { SidebarComponent } from 'src/app/layouts/privado/sidebar/sidebar.component';
import { FooterComponent } from 'src/app/layouts/privado/footer/footer.component';
import { ContentHeaderComponent } from 'src/app/layouts/privado/content-header/content-header.component';
import { ItemMenuComponent } from 'src/app/layouts/privado/sidebar/item-menu/item-menu/item-menu.component';
import { PainelCandidatoModule } from './components/private/painel-candidato/painel-candidato.module';
import { TooltipModule } from 'ng2-tooltip-directive';
import { SigninComponent } from './pages/public/signin/signin.component';
import { NovaSenhaComponent } from './pages/public/nova-senha/nova-senha.component';
import { FichaInscricaoComponent } from './pages/public/ficha-inscricao/ficha-inscricao.component';
import { SteperComponent } from './pages/wizard/steper/steper.component';
import { StepsComponent } from './components/steps/steps.component';
import { StepTemplateComponent } from './components/step-template/step-template.component';
import { DropDownListComponent } from './components/drop-down-list/drop-down-list.component';
import { TurnoComponent } from './components/turno/turno.component';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { TermosCondicoesComponent } from './components/termos-condicoes/termos-condicoes.component';
import { ContratoComponent } from './components/contrato/contrato.component';
import { PagamentoBoletoComponent } from './components/pagamento-boleto/pagamento-boleto.component';
import { PlanosCondicoesComponent } from './components/planos-condicoes/planos-condicoes.component';
import { DadosPessoaisComponent } from './components/dados-pessoais/dados-pessoais.component';
import { OpcaoCursoComponent } from './components/opcao-curso/opcao-curso.component';
import { ProcessoSeletivoComponent } from './components/processo-seletivo/processo-seletivo.component';
import { PoloComponent } from './components/polo/polo.component';
import { ConveniosComponent } from './components/convenios/convenios.component';
import { EnderecoComponent } from './components/endereco/endereco.component';
import { ExtratoCampanhaComponent } from './components/extrato-campanha/extrato-campanha.component';
import { SucessoComponent } from './pages/wizard/sucesso/sucesso.component';
import { PagamentoComponent } from './pages/wizard/pagamento/pagamento.component';
import { AceiteContratoComponent } from './pages/wizard/aceite-contrato/aceite-contrato.component';
import { SelecaoEspecificaComponent } from './pages/wizard/selecao-especifica/selecao-especifica.component';
import { TaxaInscricaoComponent } from './pages/wizard/taxa-inscricao/taxa-inscricao.component';
//import { EnemComponent } from './pages/wizard/enem/enem.component';
import { CadastroComponent } from './pages/wizard/cadastro/cadastro.component';
import { ComplementoComponent } from './pages/wizard/complemento/complemento.component';
import { DadosComplementaresComponent } from './components/dados-complementares/dados-complementares.component';
import { DeficienciaComponent } from './components/deficiencia/deficiencia.component';
import { CupomPromocionalComponent } from './components/cupom-promocional/cupom-promocional.component';
import { NgbActiveModal, NgbDropdown, NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormasPagamentoComponent } from './components/formas-pagamento/formas-pagamento.component';
import { PagamentoCartaoComponent } from './components/pagamento-cartao/pagamento-cartao.component';
import { ExtratoPagamentoComponent } from './components/extrato-pagamento/extrato-pagamento.component';
import { EqualValidator } from './directives/equal.validator.directive';
import { PhoneValidator } from './directives/phone.validator.directive';
import { CPFValidator } from './directives/cpf.validator.directive';
import { DateBirthValidator } from './directives/date-bith.validator.directive';
import { BlockCopyPasteDirective } from './directives/block-copy-paste.diretive';
import { AutocompleteOffDirective } from './directives/autocomplete-off.directive';
import { ProvaComponent } from './components/prova/prova.component';
import { FormaIngressoComponent } from './pages/wizard/forma-ingresso/forma-ingresso.component';
import { CountdownModule } from 'ngx-countdown';
import { TransferenciaComponent } from './components/transferencia/transferencia.component';
import { PortadorDiplomaComponent } from './components/portador-diploma/portador-diploma.component';
import { EnemComponent } from './components/enem/enem.component';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { HistoricoComponent } from './components/historico/historico.component';
import { RefazerSenhaGuard } from './guard/refazer-senha.guard';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { AcessoToscanaGuard } from './guard/acesso-toscana.guard';

import { TelaSenhaComponent } from './pages/private/tela-senha/tela-senha.component';
import { AcessoPainelToscanaComponent } from './pages/private/AcessoPainelToscana/AcessoPainelToscana.component';

registerLocaleData(localePt);

const maskConfig: Partial<IConfig> = {
  validation: true
};

export const customCurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  allowZero: true,
  decimal: ",",
  precision: 2,
  prefix: "R$ ",
  suffix: "",
  thousands: ".",
  nullable: true
};

/*const APP_CONTAINERS = [
  NavbarComponent,
  LayoutComponent,
  SidebarComponent,
  FooterComponent,
  ContentHeaderComponent,
  ItemMenuComponent,
  PrimeiroAcessoLayoutComponent
];*/

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LayoutComponent,
    SidebarComponent,
    FooterComponent,
    ContentHeaderComponent,
    ItemMenuComponent,
    PrimeiroAcessoLayoutComponent,
    //BaseComponent,
    SigninComponent,
    NovaSenhaComponent,
    TelaSenhaComponent,
    FichaInscricaoComponent,
    StepsComponent,
    StepTemplateComponent,
    SteperComponent,

    CadastroComponent,
    ComplementoComponent,
    DadosComplementaresComponent,
    //EnemComponent,

    TaxaInscricaoComponent,
    SelecaoEspecificaComponent,
    AceiteContratoComponent,
    PagamentoComponent,
    SucessoComponent,
    ExtratoCampanhaComponent,
    EnderecoComponent,
    ConveniosComponent,
    PoloComponent,
    ProcessoSeletivoComponent,
    OpcaoCursoComponent,
    DadosPessoaisComponent,
    PlanosCondicoesComponent,
    PagamentoCartaoComponent,
    PagamentoBoletoComponent,
    ContratoComponent,
    TermosCondicoesComponent,
    CalendarioComponent,
    TurnoComponent,
    DropDownListComponent,
    DeficienciaComponent,
    CupomPromocionalComponent,
    FormasPagamentoComponent,
    ExtratoPagamentoComponent,
    FormaIngressoComponent,
    ProvaComponent,
    HistoricoComponent,
    // DadosPessoaisComponent,
    // DadosEnderecoComponent,
    // DadosAcessibilidadeComponent,
    // DadosTelefoneComponent,
    // DadosEmailComponent,
    // DadosIdentidadeComponent,
    // ConfirmacaoInscricaoComponent,
    EqualValidator,
    PhoneValidator,
    CPFValidator,
    DateBirthValidator,
    BlockCopyPasteDirective,
    AutocompleteOffDirective,
    TransferenciaComponent,
    PortadorDiplomaComponent,
    EnemComponent,
    AcessoPainelToscanaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    PainelCandidatoModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    TooltipModule,
    NgxMaskModule.forRoot(maskConfig),
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    NgbModule,
    CountdownModule,
    BsDropdownModule.forRoot(),
  ],
  providers: [
    NgbActiveModal,
    TokenInterceptorService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    RefazerSenhaGuard,
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    AcessoToscanaGuard,
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
