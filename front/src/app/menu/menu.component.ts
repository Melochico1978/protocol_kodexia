import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule, Router } from '@angular/router'; 
import { LoadingService } from '../services/loading.service'; // Caso o arquivo mude de lugar, valide este caminho!

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  
  // Controladores reativos de visualização da interface
  menuAtual: 'principal' | 'duelo' = 'principal';
  efeitoScanline: boolean = false; 

  // Injeções de Dependência do Core
  private router = inject(Router);
  private loadingService = inject(LoadingService);

  iniciarModoHistoria() {
    // 1. Invoca a tela de carregamento oficial do Kodexia
    this.loadingService.adicionarItemLoading('inicializando-campanha');
    
    // 2. Aguarda o tempo de transição e imersão visual acabar
    setTimeout(() => {
      // 3. Remove o item e libera a renderização principal
      this.loadingService.removerItemLoading('inicializando-campanha');
      
      // 4. Redireciona o usuário direto para o terminal de introdução
      this.router.navigate(['/story/intro']);
    }, 2500);
  }

  navegar(rota: string) {
    this.router.navigate([`/${rota}`]);
  }

  alerta(mensagem: string) {
    alert(mensagem);
  }

  trocarMenu(novoMenu: 'principal' | 'duelo') {
    this.efeitoScanline = true;
    
    setTimeout(() => {
      this.menuAtual = novoMenu;
    }, 300);

    setTimeout(() => {
      this.efeitoScanline = false;
    }, 600);
  }
}