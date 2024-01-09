import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from 'src/app/layouts/privado/layout.component';
import { AuthGuard } from './auth.guard';
import { AcessoToscanaGuard } from './guard/acesso-toscana.guard';
import { RefazerSenhaGuard } from './guard/refazer-senha.guard';
import { AcessoPainelToscanaComponent } from './pages/private/AcessoPainelToscana/AcessoPainelToscana.component';
import { TelaSenhaComponent } from './pages/private/tela-senha/tela-senha.component';
import { FichaInscricaoComponent } from './pages/public/ficha-inscricao/ficha-inscricao.component';
import { NovaSenhaComponent } from './pages/public/nova-senha/nova-senha.component';
import { SigninComponent } from './pages/public/signin/signin.component';

const routes: Routes = [
  {
    path: '',
    component: FichaInscricaoComponent,
    pathMatch: 'full',
    data: { ps: null }
  },
  {
    path: 'refazerSenha',
    component: TelaSenhaComponent,
    canActivate: [RefazerSenhaGuard]
  },
  {
    path: 'acessoToscana',
    component: AcessoPainelToscanaComponent,
    canActivate: [AcessoToscanaGuard]
  },
  {
    path: 'in_company',
    component: FichaInscricaoComponent,
    data: { idPs: 307, idAreaInteresse: 443, convenioParceiro: 'convenio empresas', ignoraFimInscricao: true }
  },
  {
    path: 'presencial',
    children: [
      {
        path: '',
        component: FichaInscricaoComponent,
        data: { ps: 'GRADUAÇÃO PRESENCIAL' },
      },
      {
        path: 'vestibular100',
        component: FichaInscricaoComponent,
        data: { ps: 'GRADUAÇÃO PRESENCIAL', fi: 'VESTIBULAR 100%' }
      },
      {
        path: 'vestibular100/interno',
        component: FichaInscricaoComponent,
        data: { ps: 'GRADUAÇÃO PRESENCIAL', fi: 'VESTIBULAR 100%', ignoraFimInscricao: true }
      },

      {
        path: 'ifood',
        component: FichaInscricaoComponent,
        data: { ps: 'GRADUAÇÃO PRESENCIAL', convenioParceiro: 'ifood' }
      }
    ]
  },
  {
    path: 'pospresencial',
    children: [
      {
        path: '',
        component: FichaInscricaoComponent,
        data: { ps: 'PÓS-GRADUAÇÃO PRESENCIAL' },
      },
    ]
  },
  {
    path: 'posead',
    children: [
      {
        path: '',
        component: FichaInscricaoComponent,
        data: { ps: 'PÓS-GRADUAÇÃO EAD' },
      },
      {
        path: 'ifood',
        component: FichaInscricaoComponent,
        data: { ps: 'PÓS-GRADUAÇÃO EAD', convenioParceiro: 'ifood' }
      }
    ]
  },
  {
    path: 'semidigital',
    children: [
      {
        path: '',
        component: FichaInscricaoComponent,
        data: { ps: 'GRADUAÇÃO SEMIDIGITAL' }
      },
      {
        path: 'ifood',
        component: FichaInscricaoComponent,
        data: { ps: 'GRADUAÇÃO SEMIDIGITAL', convenioParceiro: 'ifood' }
      }
    ]
  },
  {
    path: 'ead',
    children: [
      {
        path: '',
        component: FichaInscricaoComponent,
        data: { ps: 'EAD' },
      },
      {
        path: 'ifood',
        component: FichaInscricaoComponent,
        data: { ps: 'EAD', convenioParceiro: 'ifood' }
      }
    ]
  },
  {
    path: 'medicina',
    component: FichaInscricaoComponent,
    pathMatch: 'full',
    data: { ps: 'MEDICINA' }
  },
  {
    path: 'painel-do-candidato',
    component: SigninComponent,
    pathMatch: 'full'
  },
  {
    path: 'nova-senha',
    component: NovaSenhaComponent,
    pathMatch: 'full'
  },
  {
    path: 'painel-candidato',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    data: { title: 'Painel do Candidato' },
    children: [
      {
        path: '', data: { title: 'Home' },
        loadChildren: () => import('./components/private/painel-candidato/painel-candidato.module').then(m => m.PainelCandidatoModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
