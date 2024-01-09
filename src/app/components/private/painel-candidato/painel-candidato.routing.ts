import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PainelCandidatoComponent } from './painel-candidato.component';
import { MinhasInscricoesComponent } from 'src/app/pages/private/inscricoes/minhas-inscricoes/minhas-inscricoes.component';
import { AlterarSenhaComponent } from 'src/app/pages/private/alterar-senha/alterar-senha.component';

const childRoutes: Routes = [
    {
        path: '',
        component: PainelCandidatoComponent,
        children: [
            { path: '', pathMatch: 'full', data: { title: 'Home' }, redirectTo: 'minhas-inscricoes' },
            { path: 'minhas-inscricoes', pathMatch: 'full', data: { title: 'Minhas Inscrições' }, component: MinhasInscricoesComponent },
            { path: 'alterar-senha', pathMatch: 'full', data: { title: 'Alterar Senha' }, component: AlterarSenhaComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(childRoutes)],
    exports: [RouterModule]
})
export class PainelCandidatoRoutingModule { }