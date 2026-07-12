import { Component, OnInit, signal, inject } from '@angular/core';
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
}

@Component({
  standalone: true,
  selector: 'app-cyber-code-breaker',
  imports: [CommonModule, FormsModule],
  templateUrl: './cyber-code-breaker.component.html',
  styleUrl: './cyber-code-breaker.component.css'
})
export class CyberCodeBreakerComponent implements OnInit {
  
  private router = inject(Router);

  allCommands = ['IF', 'LOOP', 'VAR', 'END', 'DATA', 'PRINT', 'FUNCTION', 'RETURN'];
  
  levels: LevelData[] = [
    { id: 1, name: 'Portão de Entrada', codeLength: 4, availableCommands: this.allCommands.slice(0, 6), maxAttempts: 10, oracleIntro: "Bem-vindo, Decoder. Eu sou o ORACLE. O primeiro firewall é básico. Descubra os 4 comandos de acesso.", oracleSuccess: "O código está correto! Prepare-se para o próximo nó.", oracleFail: "Hmph. Mais uma vez errou." },
    { id: 2, name: 'Vigília Digital', codeLength: 4, availableCommands: this.allCommands.slice(0, 6), maxAttempts: 10, oracleIntro: "Os sensores estão alertas. Use sua intuição, Decoder. O tempo é curto.", oracleSuccess: "Excelente. Acesso liberado.", oracleFail: "Detectei uma anomalia na sua cognição." },
    { id: 3, name: 'Labirinto de Dados', codeLength: 4, availableCommands: this.allCommands.slice(0, 6), maxAttempts: 10, oracleIntro: "Os servidores estão se reorganizando. Fique atento.", oracleSuccess: "Caminho livre.", oracleFail: "Você se perdeu no labirinto." },
    { id: 4, name: 'Eco da Matrix', codeLength: 4, availableCommands: this.allCommands.slice(0, 6), maxAttempts: 10, oracleIntro: "Confie nos seus instintos.", oracleSuccess: "Bom trabalho.", oracleFail: "A matrix te devorou." },
    { id: 5, name: 'Olho de Hórus', codeLength: 4, availableCommands: this.allCommands, maxAttempts: 10, oracleIntro: "A OmniCorp ativou o protocolo. Agora são mais comandos possíveis.", oracleSuccess: "Rastreio evadido.", oracleFail: "Eles nos acharam." },
    { id: 6, name: 'Coração de Trevas', codeLength: 4, availableCommands: this.allCommands, maxAttempts: 10, oracleIntro: "Cuidado com as armadilhas lógicas.", oracleSuccess: "Trevas dissipadas.", oracleFail: "Engolido pelo sistema." },
    { id: 7, name: 'Espelho Quebrado', codeLength: 4, availableCommands: this.allCommands, maxAttempts: 10, oracleIntro: "Eles estão aprendendo com você.", oracleSuccess: "Padrão quebrado.", oracleFail: "O sistema espelhou sua falha." },
    { id: 8, name: 'Código Fantasma', codeLength: 4, availableCommands: this.allCommands, maxAttempts: 10, oracleIntro: "Descubra a ordem antes que se torne um fantasma.", oracleSuccess: "Silenciados.", oracleFail: "Bem-vindo ao cemitério digital." },
    { id: 9, name: 'Torre de Babel', codeLength: 5, availableCommands: this.allCommands, maxAttempts: 10, oracleIntro: "A linguagem caótica. 5 comandos agora.", oracleSuccess: "Torre decodificada.", oracleFail: "Você sucumbiu." },
    { id: 10, name: 'Porta do Juízo', codeLength: 5, availableCommands: this.allCommands, maxAttempts: 8, oracleIntro: "Penúltimo firewall. Apenas 8 tentativas.", oracleSuccess: "Porta aberta.", oracleFail: "Você perdeu." },
    { id: 11, name: 'Sala do Trono', codeLength: 5, availableCommands: this.allCommands, maxAttempts: 8, oracleIntro: "O coração da OmniCorp. Descubra a sequência.", oracleSuccess: "O trono caiu.", oracleFail: "Falha total." },
    { id: 12, name: 'Núcleo Central', codeLength: 5, availableCommands: this.allCommands, maxAttempts: 8, oracleIntro: "Último nível. ACERTE.", oracleSuccess: "Você conseguiu. A verdade será exposta. Você é uma lenda.", oracleFail: "Nossas existências foram apagadas. GAME OVER." }
  ];

  currentLevelIndex = signal(0);
  gameState = signal<'INTRO' | 'PLAYING' | 'LEVEL_WON' | 'GAME_WON' | 'GAME_OVER'>('INTRO');
  
  secretCode: string[] = [];
  guesses: Guess[] = [];
  currentGuess: string[] = [];
  
  oracleMessage = signal('');
  isTyping = signal(false);
  dragTargetIndex = signal<number | null>(null);
  
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
    
    this.gameState.set('INTRO');
    this.typeOracleMessage(this.activeLevel.oracleIntro, () => {
      this.gameState.set('PLAYING');
    });
  }

  generateSecretCode() {
    const available = [...this.activeLevel.availableCommands];
    this.secretCode = [];
    for (let i = 0; i < this.activeLevel.codeLength; i++) {
      const rnd = Math.floor(Math.random() * available.length);
      this.secretCode.push(available[rnd]);
    }
  }

  
  selectCommand(cmd: string) {
    if (this.gameState() !== 'PLAYING') return;
    const idx = this.currentGuess.indexOf(null!);
    if (idx !== -1) {
      this.currentGuess[idx] = cmd;
    }
  }

  clearCommand(index: number) {
     if (this.gameState() !== 'PLAYING') return;
     this.currentGuess[index] = null!;
  }

  
  onDragStart(event: DragEvent, cmd: string) {
    if (this.gameState() !== 'PLAYING') {
      event.preventDefault();
      return;
    }
    event.dataTransfer?.setData('text/plain', cmd);
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

    const result = this.calculateResult(this.currentGuess, this.secretCode);
    
    this.guesses.push({
      code: [...this.currentGuess],
      exact: result.exact,
      partial: result.partial
    });

    if (result.exact === this.activeLevel.codeLength) {
      
      if (this.currentLevelIndex() === this.levels.length - 1) {
        this.gameState.set('GAME_WON');
        this.typeOracleMessage(this.activeLevel.oracleSuccess, () => {});
      } else {
        this.gameState.set('LEVEL_WON');
        this.typeOracleMessage(this.activeLevel.oracleSuccess, () => {});
      }
    } else if (this.guesses.length >= this.activeLevel.maxAttempts) {
      
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

    for (let i = 0; i < g.length; i++) {
      if (g[i] !== 'EXACT') {
        const idx = s.indexOf(g[i]);
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

  
  private typeOracleMessage(text: string, callback: () => void) {
    if (this.typeInterval) clearInterval(this.typeInterval);
    this.isTyping.set(true);
    this.oracleMessage.set('');
    let i = 0;
    this.typeInterval = setInterval(() => {
      this.oracleMessage.update(val => val + text.charAt(i));
      i++;
      if (i >= text.length) {
        clearInterval(this.typeInterval);
        this.isTyping.set(false);
        callback();
      }
    }, 20);
  }
}
