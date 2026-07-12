import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface Guess {
  colors: string[];
  blacks: number;
  whites: number;
}

@Component({
  selector: 'app-mastermind',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mastermind.component.html',
  styleUrl: './mastermind.component.css'
})
export class MastermindComponent implements OnInit {

  
  availableColors = ['#ff003c', '#00f0ff', '#00ff00', '#ffea00', '#bd00ff', '#ffffff'];
  
  secretCode: string[] = [];
  guesses: Guess[] = [];
  maxGuesses = 10;
  
  currentGuess: string[] = [null!, null!, null!, null!];
  selectedColorIndex: number = 0; 

  gameStatus: 'PLAYING' | 'WON' | 'LOST' = 'PLAYING';
  mensagemSistema: string = '> SISTEMA DE SEGURANÇA. DESCUBRA A SEQUÊNCIA (4 CORES).';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.iniciarJogo();
  }

  iniciarJogo(): void {
    this.secretCode = this.generateSecretCode();
    this.guesses = [];
    this.currentGuess = [null!, null!, null!, null!];
    this.selectedColorIndex = 0;
    this.gameStatus = 'PLAYING';
    this.mensagemSistema = '> PROTOCOLO DE INVASÃO INICIADO. INSIRA A SENHA.';
  }

  generateSecretCode(): string[] {
    const code = [];
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * this.availableColors.length);
      code.push(this.availableColors[randomIndex]);
    }
    return code;
  }

  
  setColor(color: string): void {
    if (this.gameStatus !== 'PLAYING') return;
    
    
    this.currentGuess[this.selectedColorIndex] = color;
    
    
    this.selectedColorIndex = (this.selectedColorIndex + 1) % 4;
  }

  
  selectPin(index: number): void {
    if (this.gameStatus !== 'PLAYING') return;
    this.selectedColorIndex = index;
  }

  submitGuess(): void {
    if (this.gameStatus !== 'PLAYING') return;

    
    if (this.currentGuess.some(c => c === null || c === undefined)) {
      this.mensagemSistema = '> ERRO: SEQUÊNCIA INCOMPLETA. PREENCHA OS 4 SLOTS.';
      return;
    }

    const result = this.calculateResult(this.currentGuess, this.secretCode);
    
    this.guesses.push({
      colors: [...this.currentGuess],
      blacks: result.blacks,
      whites: result.whites
    });

    if (result.blacks === 4) {
      this.gameStatus = 'WON';
      this.mensagemSistema = '> ACESSO CONCEDIDO! FIREWALL DESATIVADO.';
    } else if (this.guesses.length >= this.maxGuesses) {
      this.gameStatus = 'LOST';
      this.mensagemSistema = '> FALHA CRÍTICA! VOCÊ FOI DESCONECTADO DO SISTEMA.';
    } else {
      this.mensagemSistema = `> SENHA INCORRETA. ${this.maxGuesses - this.guesses.length} TENTATIVAS RESTANTES.`;
      this.currentGuess = [null!, null!, null!, null!];
      this.selectedColorIndex = 0;
    }
  }

  calculateResult(guess: string[], secret: string[]): { blacks: number, whites: number } {
    let blacks = 0;
    let whites = 0;
    
    const guessCopy = [...guess];
    const secretCopy = [...secret];

    
    for (let i = 0; i < 4; i++) {
      if (guessCopy[i] === secretCopy[i]) {
        blacks++;
        guessCopy[i] = 'MATCHED_GUESS';
        secretCopy[i] = 'MATCHED_SECRET';
      }
    }

    
    for (let i = 0; i < 4; i++) {
      if (guessCopy[i] !== 'MATCHED_GUESS') {
        const secretIndex = secretCopy.indexOf(guessCopy[i]);
        if (secretIndex !== -1) {
          whites++;
          secretCopy[secretIndex] = 'MATCHED_SECRET';
        }
      }
    }

    return { blacks, whites };
  }

  
  getEmptyRows(): number[] {
    const emptyCount = Math.max(0, this.maxGuesses - this.guesses.length - (this.gameStatus === 'PLAYING' ? 1 : 0));
    return Array(emptyCount).fill(0);
  }

  
  getFeedbackPegs(blacks: number, whites: number): string[] {
    const pegs = [];
    for(let i=0; i<blacks; i++) pegs.push('black');
    for(let i=0; i<whites; i++) pegs.push('white');
    while(pegs.length < 4) pegs.push('empty');
    return pegs;
  }

  voltarParaMenu(): void {
    this.router.navigate(['/']);
  }
}
