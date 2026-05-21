import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './components/loading/loading.component';
// 1. Adicionar o import do novo fundo aqui:
import { FundoCiberneticoComponent } from './components/fundo-cibernetico/fundo-cibernetico.component';
@Component({
  selector: 'app-root',
  // 2. Colocar ele na lista de imports do componente:
  imports: [RouterOutlet, LoadingComponent, FundoCiberneticoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'super-trunfo-rally';
}