import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule, Router } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { LoadingService } from '../services/loading.service';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  
  menuAtual: 'principal' | 'duelo' = 'principal';
  efeitoScanline: boolean = false; 
  mostrandoLogin: boolean = true;
  loginInput: string = '';
  nomeInput: string = '';

  constructor(
    private router: Router, 
    private loadingService: LoadingService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    if (this.usuarioService.getUsuarioLogado()) {
      this.mostrandoLogin = false;
    }
  }

  entrar() {
    if (!this.loginInput.trim() || !this.nomeInput.trim()) {
      this.alerta('Preencha login e nome!');
      return;
    }
    this.loadingService.adicionarItemLoading('login');
    this.usuarioService.loginOuCadastrar(this.loginInput, this.nomeInput).subscribe({
      next: () => {
        this.mostrandoLogin = false;
        this.loadingService.removerItemLoading('login');
      },
      error: (err) => {
        console.error(err);
        this.alerta('Erro ao conectar com o banco de dados.');
        this.loadingService.removerItemLoading('login');
      }
    });
  }

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
    
    this.efeitoScanline = true;
    
    
    setTimeout(() => {
      this.menuAtual = novoMenu;
    }, 300);

    
    setTimeout(() => {
      this.efeitoScanline = false;
    }, 600);
  }
}