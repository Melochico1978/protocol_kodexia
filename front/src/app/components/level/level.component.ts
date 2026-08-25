import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';

@Component({
  standalone: true,
  selector: 'app-level',
  imports: [FormsModule, CommonModule],
  templateUrl: './level.component.html',
  styleUrl: './level.component.css'
})
export class LevelComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  loading = inject(LoadingService);

  levelId = '0';
  userCode = '';
  executionState = signal<'idle' | 'executing' | 'success' | 'error'>('idle');

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.levelId = params.get('id') || '0';
    });
  }

  async executeCode() {
    if (!this.userCode.trim()) return;

    this.executionState.set('executing');
    
    // Simula o tempo de compilação
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const code = this.userCode.trim();
    
    // Verificações do novo desafio de login (Nome, Registro e Segurança)
    const hasNome = code.includes('String nome') && code.includes('"Zero N"');
    const hasRegistro = code.includes('int registro') && code.includes('404');
    const hasSeguranca = code.includes('String seguranca') && code.includes('"Fluffy"');
    const hasSemicolon = code.includes(';');
    
    if (hasNome && hasRegistro && hasSeguranca && hasSemicolon) {
      this.executionState.set('success');
      
      // Salva o progresso desbloqueando a FASE 2
      const nivelAtual = parseInt(localStorage.getItem('kodexia_story_progress') || '1', 10);
      if (nivelAtual < 2) localStorage.setItem('kodexia_story_progress', '2');
      
      // Tela de transição retornando para o Mapa
      setTimeout(() => {
        this.loading.adicionarItemLoading('retornando-mapa');
        
        setTimeout(() => {
          this.loading.removerItemLoading('retornando-mapa');
          this.router.navigate(['/story/map']); 
        }, 2000);
        
      }, 3000);
    } else {
      this.executionState.set('error');
    }
  }
}