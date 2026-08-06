import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartaService } from '../../services/carta.service';
import { Carta } from '../../models/carta.model';
import { CartaExibicaoComponent } from '../carta-exibicao/carta-exibicao.componet';

@Component({
  selector: 'app-partida-pvp',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CartaExibicaoComponent],
  templateUrl: './partida-pvp.component.html',
  styleUrl: './partida-pvp.component.css'
})
export class PartidaPvpComponent implements OnInit, OnDestroy {
  // Game States
  jogoIniciado: boolean = false;
  jogoAcabou: boolean = false;
  vencedor: 'P1' | 'P2' | null = null;
  vencedorRodada: 'P1' | 'P2' | 'EMPATE' | null = null; // para animacao CSS

  // Setup Names
  nomeP1: string = 'AGENTE 1';
  nomeP2: string = 'AGENTE 2';

  // Multi-screen local sync
  modoTela: 'UNICA' | 'DUPLA' = 'UNICA';
  papelLocal: 'P1' | 'P2' | null = null; // Used when modoTela === 'DUPLA'

  // Decks & Hands
  deckInicial: Carta[] = [];
  deckP1: Carta[] = [];
  deckP2: Carta[] = [];
  maoP1: Carta[] = [];
  maoP2: Carta[] = [];
  deckEmpate: Carta[] = [];

  cartaAtualP1: Carta | null = null;
  cartaAtualP2: Carta | null = null;

  // Turn management
  turnoAtaque: 'P1' | 'P2' = 'P1'; 
  
  // Novo Fluxo de passos
  passoAtual: 'SECRET_P1' | 'MESA_P1' | 'SECRET_P2' | 'MESA_P2' | 'SECRET_ATRIB_P1' | 'ESCOLHER_ATRIB_P1' | 'SECRET_ATRIB_P2' | 'ESCOLHER_ATRIB_P2' | 'COMPARAR' = 'SECRET_P1';

  // Visual Flip States
  cartaP1Revelada: boolean = false;
  cartaP2Revelada: boolean = false;
  superTrunfoAtivado: boolean = false;

  // Selected Attributes for each Player
  atributoEscolhidoP1: keyof Carta | null = null;
  nomeAtributoEscolhidoP1: string = '';
  
  atributoEscolhidoP2: keyof Carta | null = null;
  nomeAtributoEscolhidoP2: string = '';

  // System Logs
  mensagemSistema: string = '';
  mensagemSistemaDisplay: string = '';
  private typewriterInterval: any;
  mostrarGlitch: boolean = false;

  audioAtivo: boolean = false;
  private audioCtx: any = null;
  
  get totalCartasP1(): number {
    return this.deckP1.length + this.maoP1.length + (this.cartaAtualP1 ? 1 : 0);
  }

  get totalCartasP2(): number {
    return this.deckP2.length + this.maoP2.length + (this.cartaAtualP2 ? 1 : 0);
  }

  get isMinhaVez(): boolean {
    if (this.modoTela === 'UNICA') return true;
    if (!this.papelLocal) return false;
    
    if (this.passoAtual === 'MESA_P1' && this.papelLocal === 'P1') return true;
    if (this.passoAtual === 'MESA_P2' && this.papelLocal === 'P2') return true;
    
    if (this.passoAtual === 'ESCOLHER_ATRIB_P1' && this.papelLocal === 'P1') return true;
    if (this.passoAtual === 'ESCOLHER_ATRIB_P2' && this.papelLocal === 'P2') return true;
    
    return false;
  }

  constructor(
    private readonly cartaService: CartaService, 
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  private pollingInterval: any = null;

  ngOnInit(): void {
    this.carregarCartas();
    this.iniciarPollingPvp();
  }

  ngOnDestroy(): void {
    this.pararAudio();
    this.pararPollingPvp();
  }

  iniciarPollingPvp(): void {
    this.pararPollingPvp();
    this.pollingInterval = setInterval(() => {
      if (this.modoTela === 'DUPLA') {
        this.cartaService.getPartidaPvp().subscribe({
          next: (state) => {
            if (state && state.jogoIniciado && this.papelLocal) {
              if (!this.isMinhaVez) {
                this.sincronizarEstadoLocal(state);
              } else {
                if (this.passoAtual !== state.passoAtual) {
                  this.sincronizarEstadoLocal(state);
                }
              }
            }
          },
          error: (err) => console.error("Erro no polling do PvP", err)
        });
      }
    }, 1000);
  }

  pararPollingPvp(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  private carregarCartas(): void {
    this.cartaService.getCartas().subscribe({
      next: (cartas) => {
        if (cartas.length >= 8) {
          const limite = cartas.length % 2 === 0 ? cartas.length : cartas.length - 1;
          this.deckInicial = cartas.slice(0, limite);
        } else {
          alert('Você precisa de pelo menos 8 cartas cadastradas no banco para jogar!');
          this.router.navigate(['/crud']);
        }
      },
      error: (err) => {
        console.error("Erro ao carregar cartas para PvP", err);
        alert('Erro ao conectar ao banco de dados!');
        this.router.navigate(['/']);
      }
    });
  }

  definirPapelDuplo(papel: 'P1' | 'P2'): void {
    this.modoTela = 'DUPLA';
    this.papelLocal = papel;
    
    if (papel === 'P1') {
      this.cartaService.savePartidaPvp({ jogoIniciado: false }).subscribe();
    } else if (papel === 'P2') {
      this.cartaService.getPartidaPvp().subscribe({
        next: (state) => {
          if (state && state.jogoIniciado) {
            this.sincronizarEstadoLocal(state);
          }
        }
      });
    }
    this.cdr.detectChanges();
  }

  // ============== MÉTODOS DE AÇÃO DO JOGO ==============

  iniciarPartida(): void {
    if (!this.nomeP1.trim()) this.nomeP1 = 'AGENTE 1';
    if (!this.nomeP2.trim()) this.nomeP2 = 'AGENTE 2';

    this.jogoIniciado = true;
    this.jogoAcabou = false;
    this.vencedor = null;
    this.vencedorRodada = null;
    this.cartaAtualP1 = null;
    this.cartaAtualP2 = null;
    this.maoP1 = [];
    this.maoP2 = [];
    this.deckEmpate = [];
    this.turnoAtaque = 'P1';
    this.atributoEscolhidoP1 = null;
    this.nomeAtributoEscolhidoP1 = '';
    this.atributoEscolhidoP2 = null;
    this.nomeAtributoEscolhidoP2 = '';

    this.embaralharEDividir();
    this.distribuirCartas();
    
    if (this.modoTela === 'DUPLA') {
      this.passoAtual = 'MESA_P1';
      this.escreverMensagemSistema(`> INICIADO: ${this.nomeP1} VS ${this.nomeP2}. AGENTE 1 ESCOLHE CARTA.`);
    } else {
      this.passoAtual = 'SECRET_P1';
      this.escreverMensagemSistema(`> INICIALIZANDO DUELO DE AGENTES: ${this.nomeP1} VS ${this.nomeP2}`);
    }
    
    this.sincronizarServidor();
  }

  embaralharEDividir(): void {
    const embaralhado = [...this.deckInicial].sort(() => Math.random() - 0.5);
    const metade = Math.floor(embaralhado.length / 2);
    this.deckP1 = embaralhado.slice(0, metade);
    this.deckP2 = embaralhado.slice(metade);
  }

  distribuirCartas(): void {
    while (this.maoP1.length < 5 && this.deckP1.length > 0) {
      const c = this.deckP1.shift();
      if (c) this.maoP1.push(c);
    }
    while (this.maoP2.length < 5 && this.deckP2.length > 0) {
      const c = this.deckP2.shift();
      if (c) this.maoP2.push(c);
    }
  }

  avancarPassoSecreto(): void {
    this.tocarSomInterface();
    if (this.passoAtual === 'SECRET_P1') {
      this.passoAtual = 'MESA_P1';
      this.escreverMensagemSistema(`> ${this.nomeP1}, SELECIONE A SUA CARTA DE COMBATE.`);
    } else if (this.passoAtual === 'SECRET_P2') {
      this.passoAtual = 'MESA_P2';
      this.escreverMensagemSistema(`> ${this.nomeP2}, SELECIONE A SUA CARTA DE DEFESA.`);
    } else if (this.passoAtual === 'SECRET_ATRIB_P1') {
      this.passoAtual = 'ESCOLHER_ATRIB_P1';
      this.escreverMensagemSistema(`> ${this.nomeP1}, CLIQUE NA SUA CARTA PARA REVELAR OS ATRIBUTOS E ESCOLHER.`);
    } else if (this.passoAtual === 'SECRET_ATRIB_P2') {
      this.passoAtual = 'ESCOLHER_ATRIB_P2';
      this.escreverMensagemSistema(`> ${this.nomeP2}, CLIQUE NA SUA CARTA PARA REVELAR OS ATRIBUTOS E ESCOLHER.`);
    }
    this.sincronizarServidor();
  }

  selecionarCartaP1(index: number): void {
    if (this.passoAtual !== 'MESA_P1') return;
    this.cartaAtualP1 = this.maoP1.splice(index, 1)[0];
    this.tocarSomSelecionarCarta();
    
    if (this.modoTela === 'DUPLA') {
      this.passoAtual = 'MESA_P2';
      this.escreverMensagemSistema(`> REGISTRO SALVO. AGUARDANDO ESCOLHA DE CARTA DO ${this.nomeP2}.`);
    } else {
      this.passoAtual = 'SECRET_P2';
      this.escreverMensagemSistema(`> REGISTRO SALVO. PASSE O TERMINAL PARA O ${this.nomeP2}.`);
    }
    this.sincronizarServidor();
  }

  selecionarCartaP2(index: number): void {
    if (this.passoAtual !== 'MESA_P2') return;
    this.cartaAtualP2 = this.maoP2.splice(index, 1)[0];
    this.tocarSomSelecionarCarta();

    this.cartaP1Revelada = false;
    this.cartaP2Revelada = false;
    this.atributoEscolhidoP1 = null;
    this.atributoEscolhidoP2 = null;
    this.nomeAtributoEscolhidoP1 = '';
    this.nomeAtributoEscolhidoP2 = '';

    // Quem ataca escolhe o atributo primeiro
    if (this.turnoAtaque === 'P1') {
      if (this.modoTela === 'DUPLA') {
        this.passoAtual = 'ESCOLHER_ATRIB_P1';
        this.escreverMensagemSistema(`> AMBOS REGISTRADOS. ${this.nomeP1}, ESCOLHA O SEU ATRIBUTO.`);
      } else {
        this.passoAtual = 'SECRET_ATRIB_P1';
        this.escreverMensagemSistema(`> AMBOS REGISTRADOS. PASSE O TERMINAL PARA ${this.nomeP1}.`);
      }
    } else {
      if (this.modoTela === 'DUPLA') {
        this.passoAtual = 'ESCOLHER_ATRIB_P2';
        this.escreverMensagemSistema(`> AMBOS REGISTRADOS. ${this.nomeP2}, ESCOLHA O SEU ATRIBUTO.`);
      } else {
        this.passoAtual = 'SECRET_ATRIB_P2';
        this.escreverMensagemSistema(`> AMBOS REGISTRADOS. PASSE O TERMINAL PARA ${this.nomeP2}.`);
      }
    }
    this.sincronizarServidor();
  }

  revelarCartasParaEscolha(): void {
    this.tocarSomInterface();
    if (this.passoAtual === 'ESCOLHER_ATRIB_P1') {
      this.cartaP1Revelada = true;
    } else if (this.passoAtual === 'ESCOLHER_ATRIB_P2') {
      this.cartaP2Revelada = true;
    }
    this.sincronizarServidor();
  }

  escolherAtributo(atributo: keyof Carta, nomeAtributo: string): void {
    this.tocarSomAtributo();

    if (this.passoAtual === 'ESCOLHER_ATRIB_P1') {
      this.escolherAtributoP1(atributo, nomeAtributo);
    } else if (this.passoAtual === 'ESCOLHER_ATRIB_P2') {
      this.escolherAtributoP2(atributo, nomeAtributo);
    }
  }

  private escolherAtributoP1(atributo: keyof Carta, nomeAtributo: string): void {
    this.atributoEscolhidoP1 = atributo;
    this.nomeAtributoEscolhidoP1 = nomeAtributo;
    this.cartaP1Revelada = false; // Esconde a carta ao passar a vez

    if (this.turnoAtaque === 'P1') {
      // P1 começou escolhendo, agora é a vez do P2
      if (this.modoTela === 'DUPLA') {
        this.passoAtual = 'ESCOLHER_ATRIB_P2';
        this.escreverMensagemSistema(`> ${this.nomeP1} REGISTROU. VEZ DE ${this.nomeP2} ESCOLHER O ATRIBUTO.`);
      } else {
        this.passoAtual = 'SECRET_ATRIB_P2';
        this.escreverMensagemSistema(`> ${this.nomeP1} ESCOLHEU. PASSE O TERMINAL PARA ${this.nomeP2}.`);
      }
      this.sincronizarServidor();
    } else {
      // Se o turno era do P2, o P1 foi o último a escolher. Vamos para a comparação.
      this.compararAtributos();
    }
  }

  private escolherAtributoP2(atributo: keyof Carta, nomeAtributo: string): void {
    this.atributoEscolhidoP2 = atributo;
    this.nomeAtributoEscolhidoP2 = nomeAtributo;
    this.cartaP2Revelada = false;

    if (this.turnoAtaque === 'P2') {
      if (this.modoTela === 'DUPLA') {
        this.passoAtual = 'ESCOLHER_ATRIB_P1';
        this.escreverMensagemSistema(`> ${this.nomeP2} REGISTROU. VEZ DE ${this.nomeP1} ESCOLHER O ATRIBUTO.`);
      } else {
        this.passoAtual = 'SECRET_ATRIB_P1';
        this.escreverMensagemSistema(`> ${this.nomeP2} ESCOLHEU. PASSE O TERMINAL PARA ${this.nomeP1}.`);
      }
      this.sincronizarServidor();
    } else {
      this.compararAtributos();
    }
  }

  compararAtributos(): void {
    this.passoAtual = 'COMPARAR';
    this.cartaP1Revelada = true;
    this.cartaP2Revelada = true;

    const v1 = Number(this.cartaAtualP1![this.atributoEscolhidoP1!]) || 0;
    const v2 = Number(this.cartaAtualP2![this.atributoEscolhidoP2!]) || 0;

    const msgDuelo = `★ ${this.nomeP1} (${this.nomeAtributoEscolhidoP1}: ${v1}) VS ${this.nomeP2} (${this.nomeAtributoEscolhidoP2}: ${v2})`;

    const resST = this.verificarSuperTrunfo(this.cartaAtualP1!, this.cartaAtualP2!);

    if (resST) {
      this.processarResultadoPvp(resST, `★ SUPER TRUNFO! Vencedor automático: ${resST === 'P1' ? this.nomeP1 : this.nomeP2}`);
    } else {
      if (v1 > v2) {
        this.processarResultadoPvp('P1', `${msgDuelo} -> VENCEDOR: ${this.nomeP1}!`);
      } else if (v2 > v1) {
        this.processarResultadoPvp('P2', `${msgDuelo} -> VENCEDOR: ${this.nomeP2}!`);
      } else {
        this.resolverEmpate(msgDuelo);
      }
    }

    this.tocarSomImpacto();
    this.sincronizarServidor();

    setTimeout(() => {
      this.novaRodada();
    }, 4500); // tempo de espera para a nova rodada
  }

  private verificarSuperTrunfo(carta1: Carta, carta2: Carta): 'P1' | 'P2' | null {
    if (carta1.lendaria) {
      if (carta2.grupo === 'A') {
        this.escreverMensagemSistema('> ⚠️ SUPER TRUNFO ANULADO! Ambos são do Grupo A.');
        return null;
      }
      this.superTrunfoAtivado = true;
      return 'P1';
    }
    if (carta2.lendaria) {
      if (carta1.grupo === 'A') {
        this.escreverMensagemSistema('> ⚠️ SUPER TRUNFO ANULADO! Ambos são do Grupo A.');
        return null;
      }
      this.superTrunfoAtivado = true;
      return 'P2';
    }
    return null;
  }

  private processarResultadoPvp(ganhador: 'P1' | 'P2', msg: string): void {
    this.dispararGlitch();
    this.escreverMensagemSistema(msg);
    this.vencedorRodada = ganhador;
    this.darCartasAoVencedor(ganhador);
  }

  private resolverEmpate(msgDuelo: string): void {
    this.escreverMensagemSistema(`${msgDuelo} -> EMPATE! Cartas no pote.`);
    this.vencedorRodada = 'EMPATE';
    this.deckEmpate.push(this.cartaAtualP1!, this.cartaAtualP2!);
    this.dispararGlitch();
    this.turnoAtaque = this.turnoAtaque === 'P1' ? 'P2' : 'P1';
  }

  private darCartasAoVencedor(ganhador: 'P1' | 'P2'): void {
    if (ganhador === 'P1') {
      this.deckP1.push(this.cartaAtualP1!, this.cartaAtualP2!);
      if (this.deckEmpate.length > 0) {
        this.deckP1.push(...this.deckEmpate);
        this.deckEmpate = [];
      }
      this.turnoAtaque = 'P1';
    } else {
      this.deckP2.push(this.cartaAtualP2!, this.cartaAtualP1!);
      if (this.deckEmpate.length > 0) {
        this.deckP2.push(...this.deckEmpate);
        this.deckEmpate = [];
      }
      this.turnoAtaque = 'P2';
    }
  }

  novaRodada(): void {
    this.cartaAtualP1 = null;
    this.cartaAtualP2 = null;
    this.cartaP1Revelada = false;
    this.cartaP2Revelada = false;
    this.superTrunfoAtivado = false;
    this.atributoEscolhidoP1 = null;
    this.nomeAtributoEscolhidoP1 = '';
    this.atributoEscolhidoP2 = null;
    this.nomeAtributoEscolhidoP2 = '';
    this.vencedorRodada = null;

    if (this.totalCartasP1 === 0 || this.totalCartasP2 === 0) {
      this.verificarFim();
    } else {
      this.distribuirCartas();
      
      if (this.modoTela === 'DUPLA') {
        this.passoAtual = 'MESA_P1';
        this.escreverMensagemSistema(`> PRÓXIMA RODADA INICIADA. ${this.nomeP1} SELECIONA CARTA.`);
      } else {
        this.passoAtual = 'SECRET_P1';
        this.escreverMensagemSistema(`> PRÓXIMA RODADA. ${this.nomeP1}, PREPARE-SE PARA A SUA VEZ SECRETA.`);
      }
    }
    this.sincronizarServidor();
  }

  verificarFim(): void {
    this.jogoAcabou = true;
    if (this.totalCartasP1 > 0 && this.totalCartasP2 === 0) {
      this.vencedor = 'P1';
      this.escreverMensagemSistema(`> FIM DA PARTIDA. VENCEDOR: ${this.nomeP1}! AGENTE INIMIGO ELIMINADO.`);
    } else {
      this.vencedor = 'P2';
      this.escreverMensagemSistema(`> FIM DA PARTIDA. VENCEDOR: ${this.nomeP2}! AGENTE INIMIGO ELIMINADO.`);
    }
    this.sincronizarServidor();
  }

  sincronizarServidor(): void {
    if (this.modoTela !== 'DUPLA') return;
    const stateObj = {
      jogoIniciado: this.jogoIniciado,
      jogoAcabou: this.jogoAcabou,
      vencedor: this.vencedor,
      vencedorRodada: this.vencedorRodada,
      nomeP1: this.nomeP1,
      nomeP2: this.nomeP2,
      deckP1: this.deckP1,
      deckP2: this.deckP2,
      maoP1: this.maoP1,
      maoP2: this.maoP2,
      deckEmpate: this.deckEmpate,
      cartaAtualP1: this.cartaAtualP1,
      cartaAtualP2: this.cartaAtualP2,
      turnoAtaque: this.turnoAtaque,
      passoAtual: this.passoAtual,
      cartaP1Revelada: this.cartaP1Revelada,
      cartaP2Revelada: this.cartaP2Revelada,
      superTrunfoAtivado: this.superTrunfoAtivado,
      atributoEscolhidoP1: this.atributoEscolhidoP1,
      nomeAtributoEscolhidoP1: this.nomeAtributoEscolhidoP1,
      atributoEscolhidoP2: this.atributoEscolhidoP2,
      nomeAtributoEscolhidoP2: this.nomeAtributoEscolhidoP2,
      mensagemSistema: this.mensagemSistema,
      mensagemSistemaDisplay: this.mensagemSistemaDisplay
    };
    this.cartaService.savePartidaPvp(stateObj).subscribe({
      error: (err) => console.error("Erro ao salvar estado compartilhado no json-server", err)
    });
  }

  sincronizarEstadoLocal(state: any): void {
    this.jogoIniciado = state.jogoIniciado;
    this.jogoAcabou = state.jogoAcabou;
    this.vencedor = state.vencedor;
    this.vencedorRodada = state.vencedorRodada;
    this.nomeP1 = state.nomeP1;
    this.nomeP2 = state.nomeP2;
    this.deckP1 = state.deckP1;
    this.deckP2 = state.deckP2;
    this.maoP1 = state.maoP1;
    this.maoP2 = state.maoP2;
    this.deckEmpate = state.deckEmpate;
    this.cartaAtualP1 = state.cartaAtualP1;
    this.cartaAtualP2 = state.cartaAtualP2;
    this.turnoAtaque = state.turnoAtaque;
    this.passoAtual = state.passoAtual;
    this.cartaP1Revelada = state.cartaP1Revelada;
    this.cartaP2Revelada = state.cartaP2Revelada;
    this.superTrunfoAtivado = state.superTrunfoAtivado;
    this.atributoEscolhidoP1 = state.atributoEscolhidoP1;
    this.nomeAtributoEscolhidoP1 = state.nomeAtributoEscolhidoP1;
    this.atributoEscolhidoP2 = state.atributoEscolhidoP2;
    this.nomeAtributoEscolhidoP2 = state.nomeAtributoEscolhidoP2;
    this.mensagemSistema = state.mensagemSistema;
    this.mensagemSistemaDisplay = state.mensagemSistemaDisplay;
    this.cdr.detectChanges();
  }

  voltarParaMenu(): void {
    this.router.navigate(['/inicio']);
  }

  escreverMensagemSistema(texto: string): void {
    this.mensagemSistema = texto;
    if (this.typewriterInterval) clearInterval(this.typewriterInterval);
    this.mensagemSistemaDisplay = '';
    let idx = 0;
    this.typewriterInterval = setInterval(() => {
      if (idx < texto.length) {
        this.mensagemSistemaDisplay += texto.charAt(idx);
        idx++;
      } else {
        clearInterval(this.typewriterInterval);
      }
    }, 20);
  }

  dispararGlitch(): void {
    this.mostrarGlitch = true;
    setTimeout(() => { this.mostrarGlitch = false; }, 250);
  }

  // ================= ÁUDIO (SINTETIZADOR) =================

  private playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.05): void {
    if (!this.audioAtivo) return;
    try {
      this.initCtx();
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      
      gain.gain.setValueAtTime(vol, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) { console.error("Erro no áudio:", e); }
  }

  tocarSomInterface(): void {
    // Beep simples e agudo para cliques comuns (fuga, avançar turnos)
    this.playTone(800, 'sine', 0.1, 0.05);
  }

  tocarSomSelecionarCarta(): void {
    // Duplo beep (estilo lock-in cibernético)
    this.playTone(400, 'square', 0.08, 0.04);
    setTimeout(() => this.playTone(600, 'square', 0.1, 0.04), 100);
  }

  tocarSomAtributo(): void {
    // Som agudo de seleção de arma/poder
    this.playTone(1200, 'triangle', 0.15, 0.05);
  }

  tocarSomSucesso(): void {
    // Vitória (Arpeggio rápido)
    this.playTone(400, 'sine', 0.1, 0.05);
    setTimeout(() => this.playTone(600, 'sine', 0.1, 0.05), 100);
    setTimeout(() => this.playTone(800, 'sine', 0.2, 0.05), 200);
  }

  tocarSomDerrota(): void {
    // Derrota (Tom caindo)
    if (!this.audioAtivo) return;
    try {
      this.initCtx();
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, this.audioCtx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.4);
    } catch(e) {}
  }
  
  tocarSomImpacto(): void {
    if (!this.audioAtivo) return;
    try {
      this.initCtx();
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      
      // Som grave estilo explosão/impacto (Super Grave)
      osc.type = 'square';
      osc.frequency.setValueAtTime(100, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(20, this.audioCtx.currentTime + 0.5);
      
      gain.gain.setValueAtTime(0.4, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.5);
      
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.5);
    } catch (e) { console.error("Erro no som de impacto:", e); }
  }

  toggleAudio(): void {
    this.audioAtivo = !this.audioAtivo;
    if (this.audioAtivo) {
      this.initCtx();
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      this.tocarSomSucesso();
    }
  }

  private initCtx(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
  }

  private pararAudio(): void {
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }
}
