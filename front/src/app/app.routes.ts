import { Routes } from '@angular/router';
import { SplashComponent } from './components/splash/splash.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { PartidaComponent } from './partida/partida.component';
import { GerenciarCartasComponent } from './gerenciar-cartas/gerenciar-cartas.component';
import { DesconectadoComponent } from './components/desconectado/desconectado.component';
import { SelecaoDeckComponent } from './components/selecao-deck/selecao-deck.component';
import { AjudaComponent } from './components/ajuda/ajuda.component';
import { MastermindComponent } from './components/mastermind/mastermind.component';

export const routes: Routes = [
  { path: '', component: SplashComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'mesa', component: PartidaComponent },
  { path: 'crud', component: GerenciarCartasComponent },
  { path: 'deck', component: SelecaoDeckComponent }, // A nova rota da Seleção de Deck
  { path: 'desconectado', component: DesconectadoComponent }, 
  { path: 'ajuda', component: AjudaComponent },
  { path: 'mastermind', component: MastermindComponent },
  { path: '**', redirectTo: '' }, 
];