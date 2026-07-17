
import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrl: './splash.component.css',
})
export class SplashComponent implements OnInit {
  loadingMessage = signal('INICIANDO CONEXÃO SEGURA...');

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    const messages = [
      'CONECTANDO AO SERVIDOR DE TERMINAIS...',
      'CARREGANDO MÓDULOS DE BYPASS CIBERNÉTICO...',
      'INICIALIZANDO BANCO DE DADOS KODEXIA...',
      'QUEBRANDO CRIPTOGRAFIA DE BOOT...',
      'ACESSO AUTORIZADO. REDIRECIONANDO...'
    ];

    messages.forEach((msg, index) => {
      setTimeout(() => {
        this.loadingMessage.set(msg);
      }, (index + 1) * 800);
    });

    setTimeout(() => {
      this.router.navigate(['/inicio']);
    }, 5000);
  }
}