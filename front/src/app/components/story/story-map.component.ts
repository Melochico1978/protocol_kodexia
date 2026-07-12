import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FundoCiberneticoComponent } from '../fundo-cibernetico/fundo-cibernetico.component';

@Component({
  standalone: true,
  selector: 'app-story-map',
  imports: [CommonModule, FundoCiberneticoComponent],
  templateUrl: './story-map.component.html',
  styleUrl: './story-map.component.css'
})
export class StoryMapComponent implements OnInit {
  router = inject(Router);

  fases = [
    { id: '1', numero: '01', titulo: 'Inicialização', subtitulo: 'Fundamentos da Sintaxe' },
    { id: '2', numero: '02', titulo: 'Alocação de Memória', subtitulo: 'Variáveis e Tipos' },
    { id: '3', numero: '03', titulo: 'Fluxo de Controle', subtitulo: 'Condicionais if/else' },
    { id: '4', numero: '04', titulo: 'Invasão de Firewall', subtitulo: 'Cyber Code Breaker' }
  ];

  nivelAtualLiberado = signal<number>(4);
  bugHits = signal<number>(0);
  isHacked = signal<boolean>(false);

  ngOnInit() {
    const progressoSalvo = localStorage.getItem('kodexia_story_progress');
    if (progressoSalvo) {
      this.nivelAtualLiberado.set(parseInt(progressoSalvo, 10));
    }
  }

  acessarNivel(id: string) {
    if (id === '4') {
      this.router.navigate(['/story/breaker']);
    } else {
      this.router.navigate(['/story/level', id]);
    }
  }

  atacarBug() {
    this.bugHits.update(hits => hits + 1);
    
    
    if (this.bugHits() >= 3) {
      this.ativarVirus();
    }
  }

  private ativarVirus() {
    this.isHacked.set(true);
    
    
    setTimeout(() => {
      this.isHacked.set(false);
      this.bugHits.set(0);
      this.router.navigate(['/desconectado']);
    }, 2500);
  }
}