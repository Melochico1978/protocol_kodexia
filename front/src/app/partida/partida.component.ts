import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartaService } from '../services/carta.service';
import { Carta } from '../models/carta.model';
import { CartaExibicaoComponent } from '../components/carta-exibicao/carta-exibicao.componet'; 

@Component({
  selector: 'app-partida',
  standalone: true,
  imports: [CommonModule, RouterModule, CartaExibicaoComponent, FormsModule],
  templateUrl: './partida.component.html',
  styleUrl: './partida.component.css'
})
export class PartidaComponent implements OnInit, OnDestroy {
  
  faseAtual: 'INTRO' | 'ESCOLHER_CARTA' | 'ESCOLHER' | 'COMPARAR' | 'DEFENDER' = 'INTRO';

  // --- INTRO MIRABERTO ---
  introSlides = [
    { text: '"Conexão estabelecida. Bem-vindo à Arena de Duelo Cibernético do Protocol Kodexia, agente."', speaker: 'PROF. MIRABERTO' },
    { text: '"Aqui, cada carta é um Núcleo de IA Heurística. Linguagens de programação com poderes reais, compactadas em código vivo."', speaker: 'PROF. MIRABERTO' },
    { text: '"As regras são simples: escolha uma carta da sua mão, selecione um vetor de ataque — um dos 7 atributos — e compare contra a Máquina."', speaker: 'PROF. MIRABERTO' },
    { text: '"Fique atento às cartas Lendárias do Grupo A. Elas ativam o SUPER TRUNFO e vencem qualquer batalha... a menos que o oponente também tenha uma do Grupo A."', speaker: 'PROF. MIRABERTO' },
    { text: '"Eu estarei monitorando tudo daqui do laboratório. Não me decepcione, agente. O destino das IAs depende de suas escolhas."', speaker: 'PROF. MIRABERTO' },
    { text: '> SISTEMAS CALIBRADOS. PROTOCOLO DE DUELO INICIALIZADO. BOA SORTE, AGENTE.', speaker: 'SISTEMA' },
  ];
  introSlideIndex: number = 0;
  introDisplayedText: string = '';
  introIsTypingDone: boolean = false;
  private introTypeInterval: any = null;
  private introCharIndex: number = 0;
  turnoAtual: 'JOGADOR' | 'BOT' = 'JOGADOR';
  rodadaAtual: number = 1;

  deckInicial: Carta[] = [];
  deckJogador: Carta[] = [];
  maoJogador: Carta[] = [];
  deckBot: Carta[] = [];
  deckEmpate: Carta[] = [];

  cartaAtualJogador: Carta | null = null;
  cartaAtualBot: Carta | null = null;

  atributoAtaqueBot: keyof Carta | null = null;
  nomeAtributoAtaqueBot: string | null = null;

  mensagemSistema: string = '';
  mensagemSistemaDisplay: string = '';
  private typewriterInterval: any;
  mostrarGlitch: boolean = false;

  jogoAcabou: boolean = false;
  superTrunfoAtivado: boolean = false;
  vencedor: 'JOGADOR' | 'BOT' | null = null;

  nomeJogador: string = 'JOGADOR 1';
  editandoNome: boolean = false;
  vitorias: number = 0;
  trofeu: string = '🪨 Iniciante';
  vitoriasBot: number = 0;
  trofeuBot: string = '🪨 Iniciante';

  isModoBoss: boolean = false;
  jogadorHP: number = 100;
  bossHP: number = 100;

  audioAtivo: boolean = false;
  private audioCtx: any = null;
  private oscillator: any = null;
  private gainNode: any = null;
  private beepInterval: any;

  get totalCartasJogador(): number {
    return this.deckJogador.length + this.maoJogador.length + (this.cartaAtualJogador ? 1 : 0);
  }

  get totalCartasBot(): number {
    return this.deckBot.length + (this.cartaAtualBot ? 1 : 0);
  }

  constructor(private cartaService: CartaService, private router: Router) {}

  ngOnInit(): void {
    if (this.isModoBoss) return;

    if (typeof window !== 'undefined' && window.localStorage) {
      this.nomeJogador = localStorage.getItem('nomeJogador') || 'JOGADOR 1';
      this.vitorias = parseInt(localStorage.getItem('vitoriasJogador') || '0', 10);
      this.atualizarTrofeu();
      
      this.vitoriasBot = parseInt(localStorage.getItem('vitoriasBot') || '0', 10);
      this.atualizarTrofeuBot();
    }

    // Iniciar intro do Miraberto
    this.faseAtual = 'INTRO';
    this.introSlideIndex = 0;
    this.iniciarIntroTyping();
  }

  // --- MÉTODOS DA INTRO MIRABERTO ---
  get introSlideAtual() {
    return this.introSlides[this.introSlideIndex];
  }

  iniciarIntroTyping(): void {
    if (this.introTypeInterval) clearInterval(this.introTypeInterval);
    this.introDisplayedText = '';
    this.introIsTypingDone = false;
    this.introCharIndex = 0;
    const fullText = this.introSlideAtual.text;

    this.introTypeInterval = setInterval(() => {
      if (this.introCharIndex < fullText.length) {
        this.introDisplayedText += fullText.charAt(this.introCharIndex);
        this.introCharIndex++;
      } else {
        this.introIsTypingDone = true;
        clearInterval(this.introTypeInterval);
      }
    }, 30);
  }

  avancarIntro(): void {
    if (!this.introIsTypingDone) {
      // Completar texto atual instantaneamente
      clearInterval(this.introTypeInterval);
      this.introDisplayedText = this.introSlideAtual.text;
      this.introIsTypingDone = true;
    } else {
      if (this.introSlideIndex < this.introSlides.length - 1) {
        this.introSlideIndex++;
        this.iniciarIntroTyping();
      } else {
        this.finalizarIntro();
      }
    }
  }

  pularIntro(event: Event): void {
    event.stopPropagation();
    this.finalizarIntro();
  }

  finalizarIntro(): void {
    if (this.introTypeInterval) clearInterval(this.introTypeInterval);
    this.carregarDeckEIniciar();
  }

  private carregarDeckEIniciar(): void {
    const deckSelecionado = this.cartaService.getDeck();

    if (deckSelecionado.length >= 8 && deckSelecionado.length % 2 === 0) {
      this.deckInicial = [...deckSelecionado];
      this.iniciarJogo([...this.deckInicial]);
    } else {
      
      this.cartaService.getCartas().subscribe({
        next: (cartas) => {
          if (cartas.length >= 8) {
            
            const limite = cartas.length % 2 === 0 ? cartas.length : cartas.length - 1;
            this.deckInicial = cartas.slice(0, limite);
            this.iniciarJogo(this.deckInicial);
          } else {
            alert('ACESSO NEGADO: Você precisa de pelo menos 8 cartas cadastradas no banco de dados para jogar!');
            this.router.navigate(['/crud']); 
          }
        },
        error: (err) => {
          console.error("Erro ao buscar cartas", err);
          alert('ERRO: Não foi possível conectar ao banco de dados!');
          this.router.navigate(['/']);
        }
      });
    }
  }

  iniciarJogo(deck: Carta[]): void {
    this.jogoAcabou = false;
    this.vencedor = null;
    this.cartaAtualJogador = null;
    this.cartaAtualBot = null;
    this.maoJogador = [];
    this.deckEmpate = [];
    
    const embaralhado = [...deck].sort(() => Math.random() - 0.5);
    const metade = Math.floor(embaralhado.length / 2);
    
    this.deckJogador = embaralhado.slice(0, metade);
    this.deckBot = embaralhado.slice(metade);

    this.preencherMao();
    this.rodadaAtual = 1;
    this.turnoAtual = 'JOGADOR';
    this.faseAtual = 'ESCOLHER_CARTA';
    this.escreverMensagemSistema('> SELECIONE UMA CARTA DA SUA MÃO.');
    this.mostrarOverlay('INICIAR PARTIDA');
  }

  preencherMao(): void {
    while (this.maoJogador.length < 5 && this.deckJogador.length > 0) {
      const carta = this.deckJogador.shift();
      if (carta) {
        this.maoJogador.push(carta);
      }
    }
  }

  mostrarOverlay(texto: string): void {
    const overlay = document.createElement('div');
    overlay.className = 'overlay-cyberpunk';
    overlay.innerHTML = `<h1 class="texto-glitch" data-text="${texto}">${texto}</h1>`;
    document.body.appendChild(overlay);
    setTimeout(() => {
      overlay.remove();
    }, 1500);
  }

  selecionarCartaDaMao(index: number): void {
    if (this.jogoAcabou) return;
    
    const cartaSelecionada = this.maoJogador[index];
    if (cartaSelecionada && cartaSelecionada.lendaria) {
      this.tocarSomLendaria();
    } else {
      this.tocarSomClique();
    }

    if (this.faseAtual === 'ESCOLHER_CARTA') {
      if (this.maoJogador.length === 0 || this.deckBot.length === 0) {
        this.finalizarJogo();
        return;
      }

      this.cartaAtualJogador = this.maoJogador.splice(index, 1)[0];
      
      
      this.cartaAtualBot = this.escolherCartaBotInteligente(this.cartaAtualJogador);
      
      this.superTrunfoAtivado = false;
      
      this.escreverMensagemSistema('> CARTA REGISTRADA. MÁQUINA EM MODO DE ANÁLISE... SELECIONE O VETOR DE ATAQUE.');
      this.faseAtual = 'ESCOLHER';
    } else if (this.faseAtual === 'DEFENDER') {
      this.cartaAtualJogador = this.maoJogador.splice(index, 1)[0];
      this.superTrunfoAtivado = false;
      
      if (this.atributoAtaqueBot && this.nomeAtributoAtaqueBot) {
        this.batalhar(this.atributoAtaqueBot, this.nomeAtributoAtaqueBot);
      }
    }
  }

  private escolherCartaBotInteligente(cartaJogador: Carta): Carta {
    if (this.deckBot.length === 0) return null as any;

    
    const profundidade = Math.min(3, this.deckBot.length);
    
    
    if (cartaJogador.lendaria) {
      
      let indexGrupoA = this.deckBot.findIndex((c, i) => i < profundidade && c.grupo === 'A');
      if (indexGrupoA !== -1) return this.deckBot.splice(indexGrupoA, 1)[0];
      
      
      let piorIndex = 0;
      let menorMedia = Infinity;
      for (let i = 0; i < profundidade; i++) {
        const c = this.deckBot[i];
        const media = (Number(c.performance) + Number(c.sintaxe) + Number(c.seguranca) + Number(c.longevidade) + Number(c.popularidade) + Number(c.abstracao) + Number(c.versatilidade)) / 7;
        if (media < menorMedia && !c.lendaria) { 
          menorMedia = media;
          piorIndex = i;
        }
      }
      return this.deckBot.splice(piorIndex, 1)[0];
    }

    
    const atributos: (keyof Carta)[] = ['performance', 'sintaxe', 'seguranca', 'longevidade', 'popularidade', 'abstracao', 'versatilidade'];
    let melhorAtributoJogador: keyof Carta = 'performance';
    let maiorValorJogador = 0;

    for (const attr of atributos) {
      const valor = Number(cartaJogador[attr]) || 0;
      if (valor > maiorValorJogador) {
        maiorValorJogador = valor;
        melhorAtributoJogador = attr;
      }
    }

    
    let melhorIndexBot = 0;
    let maiorValorBot = -1;

    for (let i = 0; i < profundidade; i++) {
      const valorCartaBot = Number(this.deckBot[i][melhorAtributoJogador]) || 0;
      if (valorCartaBot > maiorValorBot) {
        maiorValorBot = valorCartaBot;
        melhorIndexBot = i;
      }
    }

    
    if (maiorValorBot < maiorValorJogador) {
        let piorIndex = 0;
        let menorMedia = Infinity;
        for (let i = 0; i < profundidade; i++) {
            const c = this.deckBot[i];
            const media = (Number(c.performance) + Number(c.sintaxe) + Number(c.seguranca) + Number(c.longevidade) + Number(c.popularidade) + Number(c.abstracao) + Number(c.versatilidade)) / 7;
            if (media < menorMedia && !c.lendaria) {
                menorMedia = media;
                piorIndex = i;
            }
        }
        return this.deckBot.splice(piorIndex, 1)[0];
    }

    
    return this.deckBot.splice(melhorIndexBot, 1)[0];
  }

  iniciarTurnoBot(): void {
    if (this.deckBot.length === 0) return;
    
    this.cartaAtualBot = this.deckBot.shift() || null;
    if (!this.cartaAtualBot) return;

    const atributos: { chave: keyof Carta, nome: string }[] = [
      { chave: 'performance', nome: 'PERFORMANCE' },
      { chave: 'sintaxe', nome: 'SINTAXE' },
      { chave: 'seguranca', nome: 'SEGURANÇA' },
      { chave: 'longevidade', nome: 'LONGEVIDADE' },
      { chave: 'popularidade', nome: 'POPULARIDADE' },
      { chave: 'abstracao', nome: 'ABSTRAÇÃO' },
      { chave: 'versatilidade', nome: 'VERSATILIDADE' }
    ];

    let melhorAtributo = atributos[0];
    let maiorValor = Number(this.cartaAtualBot[melhorAtributo.chave]) || 0;

    for (let i = 1; i < atributos.length; i++) {
      const valor = Number(this.cartaAtualBot[atributos[i].chave]) || 0;
      if (valor > maiorValor) {
        maiorValor = valor;
        melhorAtributo = atributos[i];
      }
    }

    this.atributoAtaqueBot = melhorAtributo.chave;
    this.nomeAtributoAtaqueBot = melhorAtributo.nome;
    
    this.escreverMensagemSistema(`> ATAQUE INIMIGO: O Bot atacou com ${this.nomeAtributoAtaqueBot}. Escolha uma carta para DEFENDER!`);
    this.faseAtual = 'DEFENDER';
  }

  private verificarSuperTrunfo(carta1: Carta, carta2: Carta): 'JOGADOR' | 'BOT' | null {
    if (carta1.lendaria) {
      if (carta2.grupo === 'A') {
        this.escreverMensagemSistema('> ⚠️ SUPER TRUNFO ANULADO! A carta adversária é do Grupo A! Combate normal iniciado...');
        return null;
      }
      this.superTrunfoAtivado = true;
      return 'JOGADOR';
    }

    if (carta2.lendaria) {
      if (carta1.grupo === 'A') {
        this.escreverMensagemSistema('> ⚠️ SUPER TRUNFO ANULADO! Sua carta é do Grupo A! Combate normal iniciado...');
        return null;
      }
      this.superTrunfoAtivado = true;
      return 'BOT';
    }

    return null;
  }

  batalhar(atributo: keyof Carta, nomeAtributo: string): void {
    this.tocarSomClique();
    if ((this.faseAtual !== 'ESCOLHER' && this.faseAtual !== 'DEFENDER') || !this.cartaAtualJogador || !this.cartaAtualBot) return;

    this.faseAtual = 'COMPARAR';

    const resultadoSuperTrunfo = this.verificarSuperTrunfo(this.cartaAtualJogador, this.cartaAtualBot);

    if (resultadoSuperTrunfo === 'JOGADOR') {
      let msg = `★ SUPER TRUNFO ACIONADO! VITÓRIA AUTOMÁTICA com ${this.cartaAtualJogador.nome}!`;
      this.deckJogador.push(this.cartaAtualJogador);
      this.deckJogador.push(this.cartaAtualBot);
      if (this.deckEmpate.length > 0) {
        msg += ` E VOCÊ CONQUISTOU AS ${this.deckEmpate.length} CARTAS ACUMULADAS!`;
        this.deckJogador.push(...this.deckEmpate);
        this.deckEmpate = [];
      }
      this.escreverMensagemSistema(`> ${msg}`);
      this.dispararGlitch();
      this.turnoAtual = 'JOGADOR';

    } else if (resultadoSuperTrunfo === 'BOT') {
      let msg = `★ SUPER TRUNFO INIMIGO! O BOT venceu automaticamente com ${this.cartaAtualBot.nome}!`;
      this.deckBot.push(this.cartaAtualBot);
      this.deckBot.push(this.cartaAtualJogador);
      if (this.deckEmpate.length > 0) {
        msg += ` O BOT LEVOU AS ${this.deckEmpate.length} CARTAS ACUMULADAS!`;
        this.deckBot.push(...this.deckEmpate);
        this.deckEmpate = [];
      }
      this.escreverMensagemSistema(`> ${msg}`);
      this.dispararGlitch();
      this.turnoAtual = 'BOT';

    } else {
      const valorJogador = Number(this.cartaAtualJogador[atributo]);
      const valorBot = Number(this.cartaAtualBot[atributo]);

      if (valorJogador > valorBot) {
        let diff = valorJogador - valorBot;
        let msg = `> BOT_EXEC_ERROR: Falha na barreira de ${nomeAtributo}.`;
        if (diff > 30) {
          msg = `> ERRO CRÍTICO: Defesas aniquiladas! O ataque de ${valorJogador} humilhou a IA (${valorBot}).`;
        } else if (diff < 5) {
          msg = `> SOBRECARGA: A máquina quase bloqueou seu ataque (${valorJogador} vs ${valorBot}). Recalibrando...`;
        } else {
          msg = `> SUCESSO: Seu ataque em ${nomeAtributo} (${valorJogador}) superou os escudos do Bot (${valorBot}).`;
        }
        
        this.deckJogador.push(this.cartaAtualJogador);
        this.deckJogador.push(this.cartaAtualBot);

        if (this.deckEmpate.length > 0) {
          msg += ` + EXTRAÇÃO DOS RECURSOS ACUMULADOS (${this.deckEmpate.length})!`;
          this.deckJogador.push(...this.deckEmpate);
          this.deckEmpate = [];
        }
        
        this.escreverMensagemSistema(msg);
        this.dispararGlitch();
        this.turnoAtual = 'JOGADOR';

      } else if (valorBot > valorJogador) {
        let diff = valorBot - valorJogador;
        let msg = `> MÁQUINA VENCEU: Padrão de ataque ineficiente em ${nomeAtributo}.`;
        if (diff > 30) {
          msg = `> BOT_EXEC: Padrão humano pífio. Bloqueio absoluto (${valorBot} vs ${valorJogador}).`;
        } else if (diff < 5) {
          msg = `> BOT_EXEC: Margem de risco detectada. Sobrevivência por eficiência calculada (${valorBot} vs ${valorJogador}).`;
        } else {
          msg = `> FALHA TÁTICA: A Inteligência Artificial esmagou seu ataque de ${valorJogador} com ${valorBot}.`;
        }
        
        this.deckBot.push(this.cartaAtualBot);
        this.deckBot.push(this.cartaAtualJogador);

        if (this.deckEmpate.length > 0) {
          msg += ` + A MÁQUINA ASSIMILOU OS DADOS EM EMPATE (${this.deckEmpate.length})!`;
          this.deckBot.push(...this.deckEmpate);
          this.deckEmpate = [];
        }

        this.escreverMensagemSistema(msg);
        this.dispararGlitch();
        this.turnoAtual = 'BOT';

      } else {
        this.escreverMensagemSistema(`> EMPATE DE SISTEMA! (${valorJogador} vs ${valorBot}) As cartas vão para o pote central.`);
        this.dispararGlitch();
        this.deckEmpate.push(this.cartaAtualJogador);
        this.deckEmpate.push(this.cartaAtualBot);
      }
    }
    
    setTimeout(() => {
      this.recolherCartas();
    }, 1500);
  }

  recolherCartas(): void {
    this.cartaAtualJogador = null;
    this.cartaAtualBot = null;
    this.superTrunfoAtivado = false;
    
    const totalJogador = this.deckJogador.length + this.maoJogador.length;

    if (totalJogador === 0 || this.deckBot.length === 0) {
      this.finalizarJogo();
    } else {
      this.preencherMao();
      
      
      this.turnoAtual = 'JOGADOR';
      this.escreverMensagemSistema('> SEU TURNO. SELECIONE UMA CARTA DA MÃO.');
      this.faseAtual = 'ESCOLHER_CARTA';
    }
  }

  finalizarJogo(): void {
    this.jogoAcabou = true;
    
    const totalJogador = this.deckJogador.length + this.maoJogador.length;
    if (totalJogador > 0 && this.deckBot.length === 0) {
      this.vencedor = 'JOGADOR';
      this.escreverMensagemSistema('> VITÓRIA ABSOLUTA! VOCÊ DOMINOU O PROTOCOLO KODEXIA!');
    } else if (this.deckBot.length > 0 && totalJogador === 0) {
      this.vencedor = 'BOT';
      this.escreverMensagemSistema('> DERROTA! A INTELIGÊNCIA ARTIFICIAL VENCEU O CONFLITO.');
    }

    if (this.vencedor === 'JOGADOR') {
      this.registrarVitoria();
    } else if (this.vencedor === 'BOT') {
      this.registrarVitoriaBot();
    }
  }

  salvarNome(): void {
    this.editandoNome = false;
    if (!this.nomeJogador || this.nomeJogador.trim() === '') {
      this.nomeJogador = 'JOGADOR 1';
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('nomeJogador', this.nomeJogador);
      
      this.vitorias = 0;
      this.vitoriasBot = 0;
      localStorage.setItem('vitoriasJogador', '0');
      localStorage.setItem('vitoriasBot', '0');
      this.atualizarTrofeu();
      this.atualizarTrofeuBot();
    }
  }

  registrarVitoria(): void {
    this.vitorias++;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('vitoriasJogador', this.vitorias.toString());
    }
    this.atualizarTrofeu();
  }

  registrarVitoriaBot(): void {
    this.vitoriasBot++;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('vitoriasBot', this.vitoriasBot.toString());
    }
    this.atualizarTrofeuBot();
  }

  atualizarTrofeu(): void {
    if (this.vitorias >= 10) {
      this.trofeu = '💎 Diamante';
    } else if (this.vitorias >= 6) {
      this.trofeu = '🥇 Ouro';
    } else if (this.vitorias >= 3) {
      this.trofeu = '🥈 Prata';
    } else if (this.vitorias >= 1) {
      this.trofeu = '🥉 Bronze';
    } else {
      this.trofeu = '🪨 Iniciante';
    }
  }

  atualizarTrofeuBot(): void {
    if (this.vitoriasBot >= 10) {
      this.trofeuBot = '💎 Diamante';
    } else if (this.vitoriasBot >= 6) {
      this.trofeuBot = '🥇 Ouro';
    } else if (this.vitoriasBot >= 3) {
      this.trofeuBot = '🥈 Prata';
    } else if (this.vitoriasBot >= 1) {
      this.trofeuBot = '🥉 Bronze';
    } else {
      this.trofeuBot = '🪨 Iniciante';
    }
  }

  jogarNovamente(): void {
    if (this.deckInicial && this.deckInicial.length > 0) {
      this.iniciarJogo([...this.deckInicial]);
    } else {
      this.voltarParaMenu();
    }
  }

  voltarParaMenu(): void {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.pararAudio();
    if (this.introTypeInterval) clearInterval(this.introTypeInterval);
  }

  toggleAudio(): void {
    if (this.audioAtivo) {
      this.pararAudio();
    } else {
      this.iniciarAudio();
    }
  }

  iniciarAudio(): void {
    if (typeof window === 'undefined') return;
    this.audioAtivo = true;
    
    const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!this.audioCtx) {
      this.audioCtx = new AudioContextClass();
    }
    
    
    const melodia = [
      392.00, 392.00, 392.00, 329.63, 261.63, 261.63, 329.63, 392.00, 
      440.00, 440.00, 440.00, 392.00, 349.23, 349.23, 392.00, 440.00, 
      392.00, 329.63, 261.63, 329.63, 392.00, 329.63, 261.63, 196.00, 
      261.63, 261.63, 293.66, 329.63, 261.63, 0,      0,      0       
    ];

    const baixo = [
      130.81, 130.81, 130.81, 130.81, 130.81, 130.81, 130.81, 130.81, 
      174.61, 174.61, 174.61, 174.61, 174.61, 174.61, 174.61, 174.61, 
      130.81, 130.81, 130.81, 130.81, 130.81, 130.81, 130.81, 130.81, 
      196.00, 196.00, 196.00, 196.00, 130.81, 130.81, 130.81, 130.81  
    ];

    let passo = 0;

    
    this.beepInterval = setInterval(() => {
      if (!this.audioCtx) return;
      
      const t = this.audioCtx.currentTime;
      const freqMelodia = melodia[passo];
      const freqBaixo = baixo[passo];

      
      if (freqMelodia > 0) {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.value = freqMelodia;
        
        
        gain.gain.setValueAtTime(0.04, t);
        gain.gain.setValueAtTime(0, t + 0.12);
        
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.15);
      }

      
      if (freqBaixo > 0) {
        const bassOsc = this.audioCtx.createOscillator();
        const bassGain = this.audioCtx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.value = freqBaixo;
        
        bassGain.gain.setValueAtTime(0.06, t);
        bassGain.gain.setValueAtTime(0, t + 0.16);
        
        bassOsc.connect(bassGain);
        bassGain.connect(this.audioCtx.destination);
        bassOsc.start(t);
        bassOsc.stop(t + 0.18);
      }

      passo = (passo + 1) % melodia.length;
    }, 180); 
  }

  pararAudio(): void {
    this.audioAtivo = false;
    if (this.beepInterval) {
      clearInterval(this.beepInterval);
      this.beepInterval = null;
    }
  }

  tocarSomClique(): void {
    if (!this.audioAtivo || !this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.audioCtx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.1);
  }

  tocarSomLendaria(): void {
    if (!this.audioAtivo || !this.audioCtx) return;
    
    
    const notas = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    
    notas.forEach((freq, i) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = 'square'; 
      osc.frequency.value = freq;
      
      const startTime = this.audioCtx.currentTime + (i * 0.08); 
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.1, startTime + 0.02);
      gain.gain.linearRampToValueAtTime(0, startTime + 0.08);
      
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + 0.1);
    });
  }

  dispararGlitch(): void {
    this.mostrarGlitch = true;
    setTimeout(() => {
      this.mostrarGlitch = false;
    }, 200);
  }

  escreverMensagemSistema(msg: string): void {
    this.mensagemSistema = msg;
    this.mensagemSistemaDisplay = '';
    let i = 0;
    
    if (this.typewriterInterval) clearInterval(this.typewriterInterval);
    
    this.tocarSomDigitacao(msg.length * 30);
    
    this.typewriterInterval = setInterval(() => {
      if (i < msg.length) {
        this.mensagemSistemaDisplay += msg.charAt(i);
        i++;
      } else {
        clearInterval(this.typewriterInterval);
      }
    }, 30); 
  }

  tocarSomDigitacao(duracaoMs: number = 300): void {
    if (!this.audioAtivo || !this.audioCtx) return;
    
    let startTime = this.audioCtx.currentTime;
    let endTime = startTime + (duracaoMs / 1000);
    
    for (let t = startTime; t < endTime; t += 0.05) {
      if (Math.random() > 0.3) {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.value = 400 + Math.random() * 200; 
        
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.05, t + 0.01);
        gain.gain.linearRampToValueAtTime(0, t + 0.03);
        
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        
        osc.start(t);
        osc.stop(t + 0.04);
      }
    }
  }
}