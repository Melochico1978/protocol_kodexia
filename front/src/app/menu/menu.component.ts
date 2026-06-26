import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule, Router } from '@angular/router'; 
import { LoadingService } from '../services/loading.service';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  
  // Variável que controla qual menu aparece
  menuAtual: 'principal' | 'duelo' = 'principal';
  efeitoScanline: boolean = false; // Controla a "onda" de transição

  constructor(private router: Router, private loadingService: LoadingService) {}

  iniciarModoHistoria() {
    this.loadingService.adicionarItemLoading('inicializando-campanha');
    setTimeout(() => {
      this.loadingService.removerItemLoading('inicializando-campanha');
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
    // Ativa a onda cibernética
    this.efeitoScanline = true;
    
    // Espera a onda passar (500ms) para trocar os botões
    setTimeout(() => {
      this.menuAtual = novoMenu;
    }, 300);

    // Remove a onda
    setTimeout(() => {
      this.efeitoScanline = false;
    }, 600);
  }
}