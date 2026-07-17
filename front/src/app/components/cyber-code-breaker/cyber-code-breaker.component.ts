import { Component, OnInit, signal, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Guess {
  code: string[];
  exact: number;
  partial: number;
}

interface LevelData {
  id: number;
  name: string;
  codeLength: number;
  availableCommands: string[];
  maxAttempts: number;
  oracleIntro: string;
  oracleSuccess: string;
  oracleFail: string;
  presetCode?: string[];
}

@Component({
  standalone: true,
  selector: 'app-cyber-code-breaker',
  imports: [CommonModule, FormsModule],
  templateUrl: './cyber-code-breaker.component.html',
  styleUrl: './cyber-code-breaker.component.css'
})
export class CyberCodeBreakerComponent implements OnInit {
  
  private readonly router = inject(Router);

  allCommands = ['IF', 'LOOP', 'VAR', 'END', 'DATA', 'PRINT', 'FUNCTION', 'RETURN'];
  
  levels: LevelData[] = [
    { id: 1, name: 'Nó 01: Variáveis', codeLength: 3, availableCommands: this.allCommands.slice(0, 6), maxAttempts: 10, oracleIntro: "Decoder, para passar por este firewall você deve declarar uma variável para dados usando a sequência ideal: VAR (Variável) -> DATA (Dados) -> END (Fim). Arraste ou clique nos comandos!", oracleSuccess: "Variável inicializada com sucesso! Acesso ao próximo nível liberado.", oracleFail: "Acesso bloqueado. Declare a variável e carregue seus dados adequadamente.", presetCode: ['VAR', 'DATA', 'END'] },
    { id: 2, name: 'Nó 02: Exibição de Dados', codeLength: 4, availableCommands: this.allCommands.slice(0, 6), maxAttempts: 10, oracleIntro: "Excelente. Agora vamos ler e imprimir uma variável. A ordem lógica é: declarar a variável (VAR), carregar as informações (DATA), imprimir na tela (PRINT) e finalizar o bloco (END).", oracleSuccess: "Mensagem impressa no console com sucesso. Próximo nó aberto.", oracleFail: "O console falhou. Garanta a ordem de declaração, atribuição e impressão.", presetCode: ['VAR', 'DATA', 'PRINT', 'END'] },
    { id: 3, name: 'Nó 03: Desvios Condicionais', codeLength: 4, availableCommands: this.allCommands.slice(0, 6), maxAttempts: 10, oracleIntro: "Firewall de Segurança Ativado! Para desviar o fluxo do vírus, declare a variável (VAR), verifique a condição lógica usando IF, envie o sinal com PRINT e encerre o bloco com END.", oracleSuccess: "Decisão lógica executada! Desvio realizado com sucesso.", oracleFail: "A condição lógica falhou. Você deve testar o IF antes de exibir os dados.", presetCode: ['VAR', 'IF', 'PRINT', 'END'] },
    { id: 4, name: 'Nó 04: Estrutura de Repetição', codeLength: 4, availableCommands: this.allCommands.slice(0, 6), maxAttempts: 10, oracleIntro: "Atenção: Precisamos rodar um ciclo automático de varredura. Inicie a variável (VAR), crie a estrutura de repetição com LOOP, exiba o rastreamento com PRINT e feche o laço com END.", oracleSuccess: "Ciclo de repetição concluído! O robô de invasão avançou.", oracleFail: "Loop infinito detectado ou fluxo quebrado. Verifique o ciclo do laço.", presetCode: ['VAR', 'LOOP', 'PRINT', 'END'] },
    { id: 5, name: 'Nó 05: Modularização', codeLength: 4, availableCommands: this.allCommands, maxAttempts: 10, oracleIntro: "Nó Crítico da OmniCorp. Para otimizar o algoritmo, encapsule-o em uma função reutilizável: FUNCTION -> VAR (declaração interna) -> RETURN (retornar o valor processado) -> END (fim).", oracleSuccess: "Função compilada com sucesso! Você obteve acesso aos firewalls dinâmicos avançados.", oracleFail: "Erro de compilação da sub-rotina. Certifique-se de definir a função e retornar seu valor.", presetCode: ['FUNCTION', 'VAR', 'RETURN', 'END'] },
    { id: 6, name: 'Coração de Trevas', codeLength: 4, availableCommands: this.allCommands, maxAttempts: 10, oracleIntro: "Cuidado com as armadilhas lógicas. A partir daqui, as senhas de segurança são aleatórias para evitar rastreamento.", oracleSuccess: "Trevas dissipadas.", oracleFail: "Engolido pelo sistema." },
    { id: 7, name: 'Espelho Quebrado', codeLength: 4, availableCommands: this.allCommands, maxAttempts: 10, oracleIntro: "Eles estão aprendendo com você.", oracleSuccess: "Padrão quebrado.", oracleFail: "O sistema espelhou sua falha." },
    { id: 8, name: 'Código Fantasma', codeLength: 4, availableCommands: this.allCommands, maxAttempts: 10, oracleIntro: "Descubra a ordem antes que se torne um fantasma.", oracleSuccess: "Silenciados.", oracleFail: "Bem-vindo ao cemitério digital." },
    { id: 9, name: 'Torre de Babel', codeLength: 5, availableCommands: this.allCommands, maxAttempts: 10, oracleIntro: "A linguagem caótica. 5 comandos agora.", oracleSuccess: "Torre decodificada.", oracleFail: "Você sucumbiu." },
    { id: 10, name: 'Porta do Juízo', codeLength: 5, availableCommands: this.allCommands, maxAttempts: 8, oracleIntro: "Penúltimo firewall. Apenas 8 tentativas.", oracleSuccess: "Porta aberta.", oracleFail: "Você perdeu." },
    { id: 11, name: 'Sala do Trono', codeLength: 5, availableCommands: this.allCommands, maxAttempts: 8, oracleIntro: "O coração da OmniCorp. Descubra a sequência.", oracleSuccess: "O trono caiu.", oracleFail: "Falha total." },
    { id: 12, name: 'Núcleo Central', codeLength: 5, availableCommands: this.allCommands, maxAttempts: 8, oracleIntro: "Último nível. ACERTE.", oracleSuccess: "Você conseguiu. A verdade será exposta. Você é uma lenda.", oracleFail: "Nossas existências foram apagadas. GAME OVER." }
  ];

  currentLevelIndex = signal(0);
  gameState = signal<'INTRO' | 'PLAYING' | 'LEVEL_WON' | 'GAME_WON' | 'GAME_OVER' | 'CREATOR_PANEL' | 'PLAYING_CUSTOM'>('INTRO');
  
  secretCode: string[] = [];
  guesses: Guess[] = [];
  currentGuess: string[] = [];
  
  oracleMessage = signal('');
  isTyping = signal(false);
  dragTargetIndex = signal<number | null>(null);
  dicasRestantes = signal(2);
  
  hoveredCommandDesc = signal<string | null>(null);

  commandDescriptions: { [key: string]: string } = {
    'VAR': 'Variável: Reserva espaço na memória do computador para guardar um valor ou informação.',
    'DATA': 'Dados: Carrega ou atribui valores primitivos (números, textos) ao sistema.',
    'PRINT': 'Impressão: Envia dados para a tela de saída (console) para visualização.',
    'IF': 'Condicional (Se): Permite ao sistema tomar decisões executando código apenas se a condição for verdadeira.',
    'LOOP': 'Repetição: Executa um bloco de instruções repetidamente enquanto a condição for válida.',
    'FUNCTION': 'Função: Bloco de código isolado e nomeado que executa uma tarefa e pode ser reutilizado.',
    'RETURN': 'Retorno: Devolve o resultado de uma função para onde ela foi chamada.',
    'END': 'Fim do Bloco: Indica o encerramento da execução de uma estrutura ou escopo de função.'
  };

  onCommandHover(cmd: string) {
    this.hoveredCommandDesc.set(this.commandDescriptions[cmd] || null);
  }

  onCommandLeave() {
    this.hoveredCommandDesc.set(null);
  }

  // --- MODO CRIAÇÃO ---
  creatorCodeLength = signal<number>(4);
  creatorMaxAttempts = signal<number>(10);
  creatorAvailableCommands = signal<string[]>(['VAR', 'DATA', 'PRINT', 'END']);
  creatorSecretCode = signal<(string | null)[]>(new Array(4).fill(null));
  creatorOracleIntro = signal<string>('');
  customLevelCode = signal<string>('');
  importLevelCode = signal<string>('');

  iniciarCriador() {
    this.gameState.set('CREATOR_PANEL');
    this.customLevelCode.set('');
    this.importLevelCode.set('');
    this.creatorSecretCode.set(new Array(this.creatorCodeLength()).fill(null));
  }

  onCreatorCodeLengthChange(length: number) {
    this.creatorCodeLength.set(length);
    this.creatorSecretCode.set(new Array(length).fill(null));
  }

  alternarComandoDisponivel(cmd: string) {
    this.creatorAvailableCommands.update(cmds => {
      if (cmds.includes(cmd)) {
        return cmds.filter(c => c !== cmd);
      } else {
        return [...cmds, cmd];
      }
    });
  }

  definirComandoSecretCode(index: number, cmd: string) {
    this.creatorSecretCode.update(code => {
      const newCode = [...code];
      newCode[index] = cmd;
      return newCode;
    });
  }

  limparComandoSecretCode(index: number) {
    this.creatorSecretCode.update(code => {
      const newCode = [...code];
      newCode[index] = null;
      return newCode;
    });
  }

  gerarCodigoCompartilhamento() {
    if (this.creatorSecretCode().some(c => c === null)) {
      alert('Por favor, defina toda a sequência secreta antes de gerar o código.');
      return;
    }
    const levelObj = {
      len: this.creatorCodeLength(),
      att: this.creatorMaxAttempts(),
      cmds: this.creatorAvailableCommands(),
      code: this.creatorSecretCode(),
      intro: this.creatorOracleIntro()
    };
    try {
      const json = JSON.stringify(levelObj);
      const base64 = btoa(unescape(encodeURIComponent(json)));
      this.customLevelCode.set(base64);
    } catch (error) {
      console.error('Falha ao gerar código:', error);
    }
  }

  carregarNivelPorCodigo(base64: string) {
    if (!base64 || base64.trim() === '') return;
    try {
      const json = decodeURIComponent(escape(atob(base64)));
      const levelObj = JSON.parse(json);
      if (levelObj && levelObj.len && levelObj.code) {
        this.creatorCodeLength.set(levelObj.len);
        this.creatorMaxAttempts.set(levelObj.att || 10);
        this.creatorAvailableCommands.set(levelObj.cmds || []);
        this.creatorSecretCode.set(levelObj.code);
        this.creatorOracleIntro.set(levelObj.intro || '');
        this.jogarNivelCustomizado();
      }
    } catch (error) {
      alert('Código de invasão inválido ou corrompido.');
    }
  }

  jogarNivelCustomizado() {
    if (this.creatorSecretCode().some(c => c === null)) {
      alert('Defina a sequência secreta completa antes de jogar.');
      return;
    }
    const customLevel: LevelData = {
      id: 99,
      name: 'Firewall Customizado',
      codeLength: this.creatorCodeLength(),
      availableCommands: this.creatorAvailableCommands(),
      maxAttempts: this.creatorMaxAttempts(),
      oracleIntro: this.creatorOracleIntro() || 'Sequência lógica de segurança customizada ativa.',
      oracleSuccess: 'Bypass efetuado! Conexão segura estabelecida.',
      oracleFail: 'Conexão recusada. Firewall bloqueou o acesso.',
      presetCode: this.creatorSecretCode() as string[]
    };

    // Remove any previously added custom levels to avoid leaks
    this.levels = this.levels.filter(l => l.id !== 99);
    this.levels.push(customLevel);
    this.currentLevelIndex.set(this.levels.length - 1);
    this.gameState.set('PLAYING_CUSTOM');
    this.startLevel();
  }

  private typeInterval: any;

  ngOnInit() {
    this.startLevel();
  }

  get activeLevel(): LevelData {
    return this.levels[this.currentLevelIndex()];
  }

  startLevel() {
    this.guesses = [];
    this.currentGuess = new Array(this.activeLevel.codeLength).fill(null);
    this.generateSecretCode();
    this.dicasRestantes.set(2);
    
    this.gameState.set('INTRO');
    this.typeOracleMessage(this.activeLevel.oracleIntro, () => {
      this.gameState.set('PLAYING');
    });
  }

  generateSecretCode() {
    if (this.activeLevel.presetCode) {
      this.secretCode = [...this.activeLevel.presetCode];
      return;
    }
    const available = [...this.activeLevel.availableCommands];
    this.secretCode = [];
    for (let i = 0; i < this.activeLevel.codeLength; i++) {
      const rnd = Math.floor(Math.random() * available.length); // NOSONAR
      this.secretCode.push(available[rnd]);
    }
  }

  
  private audioCtx: any = null;

  private getAudioContext() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  private playTone(
    type: OscillatorType,
    frequency: number,
    duration: number,
    volume: number = 0.1,
    rampFreq?: { to: number, type: 'linear' | 'exponential' }
  ) {
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      if (rampFreq) {
        if (rampFreq.type === 'linear') {
          osc.frequency.linearRampToValueAtTime(rampFreq.to, ctx.currentTime + duration);
        } else {
          osc.frequency.exponentialRampToValueAtTime(rampFreq.to, ctx.currentTime + duration);
        }
      }
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (error) {
      console.warn('Audio play failed:', error);
    }
  }

  playBeepClick() {
    this.playTone('sine', 800, 0.1, 0.1, { to: 150, type: 'exponential' });
  }

  playBeepType() {
    // Ruído de teclado mecânico retrô: oscilação rápida com frequência aleatória sutil
    const freq = 600 + Math.random() * 300;
    this.playTone('triangle', freq, 0.02, 0.03);
  }

  playBeepSuccess() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.1 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.18);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.18);
      });
    } catch (error) {
      console.warn('Audio play failed:', error);
    }
  }

  playBeepFail() {
    this.playTone('sawtooth', 180, 0.4, 0.12, { to: 90, type: 'linear' });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.gameState() !== 'PLAYING' || this.isTyping()) return;

    if (event.key >= '1' && event.key <= '8') {
      this.handleNumberKey(event.key);
    } else if (event.key === 'Backspace') {
      this.handleBackspaceKey(event);
    } else if (event.key === 'Enter') {
      this.handleEnterKey();
    }
  }

  private handleNumberKey(key: string) {
    const idx = Number.parseInt(key, 10) - 1;
    const commands = this.activeLevel.availableCommands;
    if (idx < commands.length) {
      this.selectCommand(commands[idx]);
    }
  }

  private handleBackspaceKey(event: KeyboardEvent) {
    event.preventDefault();
    let lastFilledIdx = -1;
    for (let i = this.currentGuess.length - 1; i >= 0; i--) {
      if (this.currentGuess[i] !== null) {
        lastFilledIdx = i;
        break;
      }
    }
    if (lastFilledIdx !== -1) {
      this.clearCommand(lastFilledIdx);
    }
  }

  private handleEnterKey() {
    if (!this.currentGuess.includes(null!)) {
      this.submitGuess();
    }
  }

  selectCommand(cmd: string) {
    if (this.gameState() !== 'PLAYING') return;
    const idx = this.currentGuess.indexOf(null!);
    if (idx !== -1) {
      this.playBeepClick();
      this.currentGuess[idx] = cmd;
    }
  }

  clearCommand(index: number) {
    if (this.gameState() !== 'PLAYING') return;
    this.playBeepClick();
    this.currentGuess[index] = null!;
  }

  
  onDragStart(event: DragEvent, cmd: string) {
    if (this.gameState() !== 'PLAYING') {
      event.preventDefault();
      return;
    }
    event.dataTransfer?.setData('text/plain', cmd);

    // Create a clean custom element to be the drag image, avoiding the ugly default browser shadow
    const dragIcon = document.createElement('div');
    dragIcon.id = 'drag-ghost-element';
    dragIcon.innerText = cmd;
    dragIcon.style.position = 'absolute';
    dragIcon.style.top = '-9999px';
    dragIcon.style.padding = '6px 14px';
    dragIcon.style.background = '#00e5ff';
    dragIcon.style.color = '#04040c';
    dragIcon.style.fontFamily = "'Share Tech Mono', monospace";
    dragIcon.style.fontSize = '14px';
    dragIcon.style.fontWeight = 'bold';
    dragIcon.style.borderRadius = '4px';
    dragIcon.style.boxShadow = '0 0 10px rgba(0, 229, 255, 0.8)';
    dragIcon.style.pointerEvents = 'none';

    document.body.appendChild(dragIcon);
    event.dataTransfer?.setDragImage(dragIcon, 30, 15);

    // Clean up the temporary element on the next tick
    setTimeout(() => {
      document.getElementById('drag-ghost-element')?.remove();
    }, 0);
  }

  onDragOver(event: DragEvent, index: number) {
    if (this.gameState() !== 'PLAYING') return;
    event.preventDefault(); 
    this.dragTargetIndex.set(index);
  }

  onDragLeave(event: DragEvent) {
    this.dragTargetIndex.set(null);
  }

  onDrop(event: DragEvent, index: number) {
    if (this.gameState() !== 'PLAYING') return;
    event.preventDefault();
    this.dragTargetIndex.set(null);
    const cmd = event.dataTransfer?.getData('text/plain');
    if (cmd) {
      this.currentGuess[index] = cmd;
    }
  }

  submitGuess() {
    if (this.gameState() !== 'PLAYING') return;
    
    if (this.currentGuess.some(c => !c)) return;

    this.playBeepClick();
    const result = this.calculateResult(this.currentGuess, this.secretCode);
    
    this.guesses.push({
      code: [...this.currentGuess],
      exact: result.exact,
      partial: result.partial
    });

    if (result.exact === this.activeLevel.codeLength) {
      this.playBeepSuccess();
      if (this.currentLevelIndex() === this.levels.length - 1) {
        this.gameState.set('GAME_WON');
        this.typeOracleMessage(this.activeLevel.oracleSuccess, () => {});
      } else {
        this.gameState.set('LEVEL_WON');
        this.typeOracleMessage(this.activeLevel.oracleSuccess, () => {});
      }
    } else if (this.guesses.length >= this.activeLevel.maxAttempts) {
      this.playBeepFail();
      this.gameState.set('GAME_OVER');
      this.typeOracleMessage(this.activeLevel.oracleFail, () => {});
    } else {
      this.currentGuess = new Array(this.activeLevel.codeLength).fill(null);
      
      let dica = "> Falha na decodificação. Tente novamente.";
      if (result.exact > 0 && result.partial > 0) {
        dica = "> Interessante. Você encontrou a posição exata de alguns comandos, e outros estão corretos mas no lugar errado. Reorganize-os.";
      } else if (result.exact > 0) {
        dica = `> Bom. ${result.exact} comando(s) está perfeitamente alinhado. Mantenha-o aí e troque o resto.`;
      } else if (result.partial > 0) {
        dica = `> Estou detectando ressonância. ${result.partial} comando(s) que você usou faz parte da senha, mas em posições incorretas.`;
      } else if (result.exact === 0 && result.partial === 0) {
        dica = "> Erro crítico. ABSOLUTAMENTE NENHUM desses comandos faz parte da senha. Esqueça-os.";
      }
      
      this.typeOracleMessage(dica, () => {});
    }
  }

  calculateResult(guess: string[], secret: string[]): { exact: number, partial: number } {
    let exact = 0;
    let partial = 0;
    const g = [...guess];
    const s = [...secret];

    for (let i = 0; i < g.length; i++) {
      if (g[i] === s[i]) {
        exact++;
        g[i] = 'EXACT';
        s[i] = 'EXACT';
      }
    }

    for (const val of g) {
      if (val !== 'EXACT') {
        const idx = s.indexOf(val);
        if (idx !== -1) {
          partial++;
          s[idx] = 'EXACT';
        }
      }
    }
    return { exact, partial };
  }

  nextLevel() {
    if (this.currentLevelIndex() < this.levels.length - 1) {
      this.currentLevelIndex.update(idx => idx + 1);
      this.startLevel();
    }
  }

  restartGame() {
    this.currentLevelIndex.set(0);
    this.startLevel();
  }

  voltarParaMapa() {
    this.router.navigate(['/story/map']);
  }

  pedirDica() {
    if (this.gameState() !== 'PLAYING' || this.dicasRestantes() <= 0 || this.isTyping()) return;

    this.playBeepClick();
    this.dicasRestantes.update(n => n - 1);
    
    // Choose randomly between:
    // 1. Revealing correct position of a command in secretCode
    // 2. Excluding a command that is NOT in secretCode
    const chooseType = Math.random() > 0.4; // NOSONAR
    
    if (chooseType) {
      this.revelarPosicaoCorreta();
    } else {
      const wrongCmds = this.activeLevel.availableCommands.filter(cmd => !this.secretCode.includes(cmd));
      if (wrongCmds.length > 0) {
        const randWrong = wrongCmds[Math.floor(Math.random() * wrongCmds.length)]; // NOSONAR
        const msg = `> Pista Decodificada: O comando '${randWrong}' NÃO faz parte da senha deste nó.`;
        this.typeOracleMessage(msg, () => {});
      } else {
        this.revelarPosicaoCorreta();
      }
    }
  }

  private revelarPosicaoCorreta() {
    const randIdx = Math.floor(Math.random() * this.secretCode.length); // NOSONAR
    const correctCmd = this.secretCode[randIdx];
    const msg = `> Pista Decodificada: O comando '${correctCmd}' está na posição ${randIdx + 1} da sequência.`;
    this.typeOracleMessage(msg, () => {});
  }

  private typeOracleMessage(text: string, callback: () => void) {
    if (this.typeInterval) clearInterval(this.typeInterval);
    this.isTyping.set(true);
    this.oracleMessage.set('');
    let i = 0;
    this.typeInterval = setInterval(() => {
      this.oracleMessage.update(val => val + text.charAt(i));
      // Typewriter ticking sound on every second character
      if (i % 2 === 0) {
        this.playBeepType();
      }
      i++;
      if (i >= text.length) {
        clearInterval(this.typeInterval);
        this.isTyping.set(false);
        callback();
      }
    }, 20);
  }
}
