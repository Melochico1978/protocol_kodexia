import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-minigame-logica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './minigame-logica.component.html',
  styleUrl: './minigame-logica.component.css'
})
export class MinigameLogicaComponent implements OnInit, OnDestroy {

  faseAtual: 0 | 1 | 2 | 3 | 4 = 0;
  
  // Terminal Dialog
  dialogos = [
    { text: '"Agente, a segurança de primeiro nível está bloqueando nosso acesso."', speaker: 'PROF. MIRABERTO' },
    { text: '"O sistema aguarda as credenciais de administrador. Eu recuperei os dados originais no banco de dados deles:"', speaker: 'PROF. MIRABERTO' },
    { text: '"Usuário: Joao N (texto) | Senha: Fluffy (texto) | Número: 404 (inteiro)"', speaker: 'PROF. MIRABERTO' },
    { text: '"Insira essas credenciais no console para podermos enganar a trava principal."', speaker: 'PROF. MIRABERTO' }
  ];
  dialogoIndex = 0;
  textoExibido = '';
  private typewriterInterval: any;

  // Fase 1 Inputs
  inputUsuario: string = '';
  inputSenha: string = '';
  inputNumero: string = '';

  // Fase 2 Inputs
  operador1: string = '';
  operador2: string = '';

  // Fase 3 Inputs
  inputX: number | null = null;
  inputY: number | null = null;

  matriz: string[][] = [];
  explosao: boolean = false;
  mensagemTerminal: string = '> AGUARDANDO INSERÇÃO DE DADOS...';

  constructor(private router: Router) {}

  ngOnInit() {
    this.iniciarTypewriter();
  }

  ngOnDestroy() {
    if (this.typewriterInterval) clearInterval(this.typewriterInterval);
  }

  iniciarTypewriter() {
    if (this.typewriterInterval) clearInterval(this.typewriterInterval);
    this.textoExibido = '';
    const fullText = this.dialogos[this.dialogoIndex].text;
    let i = 0;
    this.typewriterInterval = setInterval(() => {
      this.textoExibido += fullText.charAt(i);
      i++;
      if (i >= fullText.length) {
        clearInterval(this.typewriterInterval);
      }
    }, 30);
  }

  avancarDialogo() {
    if (this.textoExibido.length < this.dialogos[this.dialogoIndex].text.length) {
      clearInterval(this.typewriterInterval);
      this.textoExibido = this.dialogos[this.dialogoIndex].text;
    } else {
      this.dialogoIndex++;
      if (this.dialogoIndex < this.dialogos.length) {
        this.iniciarTypewriter();
      } else {
        this.dialogoIndex = this.dialogos.length - 1; // Trava no último diálogo para não quebrar o HTML
        this.faseAtual = 1;
        this.mensagemTerminal = '> DECLARE AS VARIÁVEIS DO SISTEMA';
      }
    }
  }

  validarFase1() {
    this.mensagemTerminal = `Credenciais recebidas!\nUsuário recebido: ${this.inputUsuario}\nSenha recebida: ${this.inputSenha}\nNúmero recebido: ${this.inputNumero}`;
    setTimeout(() => {
      this.faseAtual = 2;
      this.dialogos = [
        { text: '"Ótimo. O sistema capturou nossas variáveis. Mas agora ele vai processar a autenticação por trás dos panos."', speaker: 'PROF. MIRABERTO' },
        { text: '"Ele possui uma estrutura condicional rígida: todos os três dados precisam bater exatamente ao mesmo tempo usando o operador E."', speaker: 'PROF. MIRABERTO' }
      ];
      this.dialogoIndex = 0;
      this.iniciarTypewriter();
    }, 2500);
  }

  validarFase2() {
    // Autenticando com &&
    if (this.operador1 === '&&' && this.operador2 === '&&') {
      if (this.inputUsuario === 'Joao N' && this.inputSenha === 'Fluffy' && this.inputNumero === '404') {
        this.mensagemTerminal = '✅ AUTORIZADO — Acesso concedido!';
        setTimeout(() => {
          this.faseAtual = 3;
          this.dialogos = [
            { text: '"Conseguimos! A condição foi verdadeira."', speaker: 'PROF. MIRABERTO' },
            { text: '"Atenção! Passamos da porta principal, mas entramos em um setor protegido por uma Matriz de Segurança Explosiva."', speaker: 'PROF. MIRABERTO' },
            { text: '"A regra que interceptei é estrita: A coordenada X deve ser PAR e MENOR QUE 3. A coordenada Y deve ser ÍMPAR e MAIOR QUE 2."', speaker: 'PROF. MIRABERTO' },
            { text: '"Se os parâmetros estiverem errados, o sistema de defesa detona a nossa conexão."', speaker: 'PROF. MIRABERTO' }
          ];
          this.dialogoIndex = 0;
          this.iniciarTypewriter();
        }, 2000);
      } else {
        this.mensagemTerminal = '❌ NÃO AUTORIZADO — Credenciais inválidas digitadas na Fase 1!';
        this.falhaCritica();
      }
    } else {
      this.mensagemTerminal = '❌ ERRO DE SINTAXE LÓGICA — Você foi detectado pelo firewall!';
      this.falhaCritica();
    }
  }

  validarFase3() {
    if (this.inputX === null || this.inputY === null) return;
    
    const x = this.inputX;
    const y = this.inputY;

    if ((x % 2 === 0 && x < 3) && (y % 2 !== 0 && y > 2)) {
      this.mensagemTerminal = 'COORDENADAS VÁLIDAS. DESCRIPTOGRAFANDO NÚCLEO...';
      this.faseAtual = 4;
      this.gerarMatriz(x, y);
      
      this.dialogos = [
        { text: '"Extração concluída! Você acaba de dominar arrays bidimensionais e lógica condicional. Retornando à base."', speaker: 'PROF. MIRABERTO' }
      ];
      this.dialogoIndex = 0;
      this.iniciarTypewriter();
    } else {
      this.mensagemTerminal = '💥 BOMBA! 💥 Coordenadas inválidas! Sistema explodiu por erro de parâmetros!';
      this.explosao = true;
      this.tocarSomExplosao();
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3000);
    }
  }

  gerarMatriz(targetX: number, targetY: number) {
    this.matriz = [];
    for (let i = 0; i < 5; i++) {
      let linha = [];
      for (let j = 0; j < 5; j++) {
        if (j === targetX && i === targetY) {
          linha.push('[X]');
        } else {
          linha.push('[0]');
        }
      }
      this.matriz.push(linha);
    }
  }

  falhaCritica() {
    this.explosao = true;
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 3000);
  }

  tocarSomExplosao() {
    try {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
      gain.gain.setValueAtTime(1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1);
    } catch(e) {}
  }
  
  concluirDesafio() {
    const progressoSalvo = localStorage.getItem('kodexia_story_progress');
    let nivel = 5;
    if (progressoSalvo) {
      nivel = Math.max(parseInt(progressoSalvo, 10), 6);
    }
    localStorage.setItem('kodexia_story_progress', nivel.toString());
    this.router.navigate(['/story/map']);
  }
}
