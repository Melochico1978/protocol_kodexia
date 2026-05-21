import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartaService } from '../services/carta.service';
import { Carta } from '../models/carta.model';
import { CartaExibicaoComponent } from '../components/carta-exibicao/carta-exibicao.componet'; 

@Component({
  selector: 'app-partida',
  standalone: true,
  imports: [CommonModule, RouterModule, CartaExibicaoComponent],
  templateUrl: './partida.component.html',
  styleUrl: './partida.component.css'
})
export class PartidaComponent implements OnInit {
  
  // Fases do turno visual: 
  // COMPRAR (puxar do monte) -> ESCOLHER (menu de atributos) -> COMPARAR (revela bot e mostra quem ganhou)
  faseAtual: 'COMPRAR' | 'ESCOLHER' | 'COMPARAR' = 'COMPRAR';

  deckJogador: Carta[] = [];
  deckBot: Carta[] = [];
  deckEmpate: Carta[] = []; // O "Pote" do Empate

  cartaAtualJogador: Carta | null = null;
  cartaAtualBot: Carta | null = null;

  mensagemSistema: string = '> PROTOCOLO DE COMBATE INICIADO. COMPRE UMA CARTA.';
  jogoAcabou: boolean = false;

  constructor(private cartaService: CartaService, private router: Router) {}

  ngOnInit(): void {
    const deckCompleto = this.cartaService.getDeck();
    
    // Proteção com ALERTA VISUAL: Avisa o jogador antes de o barrar!
    if (deckCompleto.length < 8 || deckCompleto.length % 2 !== 0) {
      alert('ACESSO NEGADO: Você precisa selecionar pelo menos 8 cartas na Oficina antes de entrar na Arena!');
      this.router.navigate(['/crud']); 
      return;
    }
    
    this.iniciarJogo(deckCompleto);
  }

  iniciarJogo(deck: Carta[]): void {
    // Algoritmo de Fisher-Yates para embaralhar
    const embaralhado = [...deck].sort(() => Math.random() - 0.5);
    const metade = Math.floor(embaralhado.length / 2);
    
    this.deckJogador = embaralhado.slice(0, metade);
    this.deckBot = embaralhado.slice(metade);
  }

  // Ação 1: O Jogador clica no seu baralho para puxar
  puxarCartas(): void {
    if (this.faseAtual !== 'COMPRAR' || this.jogoAcabou) return;

    if (this.deckJogador.length === 0 || this.deckBot.length === 0) {
      this.finalizarJogo();
      return;
    }

    this.cartaAtualJogador = this.deckJogador.shift() || null;
    this.cartaAtualBot = this.deckBot.shift() || null; // O bot puxa junto escondido
    
    this.mensagemSistema = '> CARTA CARREGADA. SELECIONE O VETOR DE ATAQUE.';
    this.faseAtual = 'ESCOLHER';
  }

  // Ação 2: O Jogador clica num atributo na arena central
  batalhar(atributo: keyof Carta, nomeAtributo: string): void {
    if (this.faseAtual !== 'ESCOLHER' || !this.cartaAtualJogador || !this.cartaAtualBot) return;

    this.faseAtual = 'COMPARAR'; // Muda a fase para revelar a carta inimiga

    const valorJogador = Number(this.cartaAtualJogador[atributo]);
    const valorBot = Number(this.cartaAtualBot[atributo]);

    if (valorJogador > valorBot) {
      // JOGADOR VENCE O TURNO
      let msg = `VITÓRIA! Seu ${nomeAtributo} (${valorJogador}) superou o Bot (${valorBot}).`;
      
      this.deckJogador.push(this.cartaAtualJogador);
      this.deckJogador.push(this.cartaAtualBot);

      // Regra "Empate Leva Tudo"
      if (this.deckEmpate.length > 0) {
        msg += ` E VOCÊ CONQUISTOU AS ${this.deckEmpate.length} CARTAS ACUMULADAS!`;
        this.deckJogador.push(...this.deckEmpate);
        this.deckEmpate = []; // Esvazia o pote
      }
      
      this.mensagemSistema = `> ${msg}`;

    } else if (valorBot > valorJogador) {
      // BOT VENCE O TURNO
      let msg = `FALHA CRÍTICA! O Bot superou seu ${nomeAtributo} (${valorJogador} vs ${valorBot}).`;
      
      this.deckBot.push(this.cartaAtualBot);
      this.deckBot.push(this.cartaAtualJogador);

      // Regra "Empate Leva Tudo"
      if (this.deckEmpate.length > 0) {
        msg += ` O BOT LEVOU AS ${this.deckEmpate.length} CARTAS ACUMULADAS!`;
        this.deckBot.push(...this.deckEmpate);
        this.deckEmpate = []; // Esvazia o pote
      }

      this.mensagemSistema = `> ${msg}`;

    } else {
      // EMPATE
      this.mensagemSistema = `> EMPATE DE SISTEMA! (${valorJogador} vs ${valorBot}) As cartas vão para o pote central.`;
      
      // As cartas vão para o "monte deitado"
      this.deckEmpate.push(this.cartaAtualJogador);
      this.deckEmpate.push(this.cartaAtualBot);
    }

    // Espera 3.5 segundos para o jogador ler o resultado, depois limpa a mesa
    setTimeout(() => {
      this.recolherCartas();
    }, 3500);
  }

  // Ação 3 (Automática): Limpa a mesa para o próximo turno
  recolherCartas(): void {
    this.cartaAtualJogador = null;
    this.cartaAtualBot = null;
    
    if (this.deckJogador.length === 0 || this.deckBot.length === 0) {
      this.finalizarJogo();
    } else {
      this.mensagemSistema = '> TURNO ENCERRADO. COMPRE UMA NOVA CARTA.';
      this.faseAtual = 'COMPRAR';
    }
  }

  finalizarJogo(): void {
    this.jogoAcabou = true;
    
    if (this.deckJogador.length > 0) {
      this.mensagemSistema = '> VITÓRIA ABSOLUTA! VOCÊ DOMINOU O PROTOCOLO KODEXIA!';
    } else {
      this.mensagemSistema = '> DERROTA! A INTELIGÊNCIA ARTIFICIAL VENCEU O CONFLITO.';
    }
  }

  voltarParaMenu(): void {
    this.router.navigate(['/']);
  }
}