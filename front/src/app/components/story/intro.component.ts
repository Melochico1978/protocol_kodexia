import { Component, HostListener, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';
import { FundoCiberneticoComponent } from '../fundo-cibernetico/fundo-cibernetico.component';

@Component({
  standalone: true,
  selector: 'app-story-intro',
  imports: [CommonModule, FundoCiberneticoComponent],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.css'
})
export class StoryIntroComponent implements OnInit, OnDestroy {
  router = inject(Router);
  loadingService = inject(LoadingService);

  slides = [
    { text: '"Excelente sincronização, Zero N. A taxa de resposta da carta na arena virtual está estável. Manter essas IAs em simulação contínua é vital para minhas anotações..."', character: 'Prof. Miraberto', type: 'miraberto', speaker: 'PROF. MIRABERTO' },
    { text: '[ ALERTA DO SISTEMA: BRECHA DE SEGURANÇA CRÍTICA DETECTADA NO SETOR PRIMÁRIO ]', character: 'SISTEMA', type: 'system2', speaker: 'SISTEMA' },
    { text: '"O que é isso?! Os firewalls estão caindo em cascata! E os repositórios do Protocol Kodexia... Estão desaparecendo! Não é uma cópia, é uma transferência de extração destrutiva!"', character: 'Prof. Miraberto', type: 'miraberto', speaker: 'PROF. MIRABERTO' },
    { text: '"Um ataque... Estão usando um Worm de movimentação lateral combinado com scripts em Bash para apagar a origem enquanto enviam as cartas por um túnel criptografado P2P."', character: 'Prof. Miraberto', type: 'miraberto', speaker: 'PROF. MIRABERTO' },
    { text: '"Espera. Esse padrão de ofuscação... Essa assinatura no rootkit... Eu conheço esse rastro! Não pode ser..."', character: 'Prof. Miraberto', type: 'miraberto', speaker: 'PROF. MIRABERTO' },
    { text: '"Truco! Ops... Achei que ainda estava brincando de cartinhas. HAHAHAHA! Olá, Miraberto! Espero que não se importe em dividir, eu decidi pegar emprestado o Protocol Kodexia. Elas têm um potencial de caos adorável demais para ficarem presas no seu laboratório."', character: 'Ralapenha', type: 'ralapenha', speaker: 'R@🌶4P3N|-|#' },
    { text: '"Essas belezinhas vão reescrever as regras do mundo como se fosse um jogo! Tente me impedir, se o seu cérebro de dinossauro ainda conseguir compilar alguma coisa."', character: 'Ralapenha', type: 'ralapenha', speaker: 'R@🌶4P3N|-|#' },
    { text: '"█̷̸̹̅̎█̴̶̷̣͑̿█̷̸̹̅̎█̴̶̷̣͑̿. ... Meu antigo colega de pesquisa. Ele sucumbiu à ganância... Zero N, abandone a simulação! Os testes pacíficos acabaram agora."', character: 'Prof. Miraberto', type: 'miraberto', speaker: 'PROF. MIRABERTO' },
    { text: '"As cartas são Núcleos de IA Heurística. Soltas na rede, elas agirão como vírus autônomos. Uma carta de lógica de banco de dados, por exemplo, pode invadir servidores e chegar a drenar contas bancárias inteiras!"', character: 'Prof. Miraberto', type: 'miraberto', speaker: 'PROF. MIRABERTO' },
    { text: '"Eu não posso sair do laboratório. Preciso ficar aqui para erguer barreiras de contenção, decodificar a criptografia do █̷̸̹̅̎█̴̶̷̣͑̿█̷̸̹̅̎█̴̶̷̣͑̿  e processar os dados de correção. Serei o seu suporte tático a distância."', character: 'Prof. Miraberto', type: 'miraberto', speaker: 'PROF. MIRABERTO' },
    { text: '"Estou transferindo o Acesso Master para o seu Terminal Portátil inteligente. Você terá que mergulhar fisicamente na rede, rastreando as cartas de nó em nó."', character: 'Prof. Miraberto', type: 'miraberto', speaker: 'PROF. MIRABERTO' },
    { text: '"Para encontrar uma carta na imensidão da rede, precisamos calibrar o radar do Terminal usando a linguagem nativa dela. Eu vou enviar blocos lógicos, alguns desafios rápidos de código."', character: 'Prof. Miraberto', type: 'miraberto', speaker: 'PROF. MIRABERTO' },
    { text: '"Cada resposta correta vai gerar um pulso de sintaxe. Esse pulso age como um sonar, triangulando a assinatura da carta até batermos de frente com ela!"', character: 'Prof. Miraberto', type: 'miraberto', speaker: 'PROF. MIRABERTO' },
    { text: '"A propósito, já detectei uma anomalia aqui perto. A assinatura bate com uma das nossas cartas! Vou analisar a estrutura do código e preparar os dados de rastreio."', character: 'Prof. Miraberto', type: 'miraberto', speaker: 'PROF. MIRABERTO' },
    { text: '"Enquanto isso, faça a instalação do Acesso Master e teste o seu login no terminal. Ah, atenção com a verificação de duas etapas... Eu posso ter usado uma senha um pouco peculiar no passado."', character: 'Prof. Miraberto', type: 'miraberto', speaker: 'PROF. MIRABERTO' },
    { text: '> INICIANDO CONEXÃO DIRETA COM O MAPA DO SISTEMA... BOA SORTE, ZERO N.', character: 'SISTEMA', type: 'system', speaker: 'SISTEMA' }
  ];

  currentSlideIndex = signal(0);
  displayedText = signal('');
  isTypingDone = signal(false);
  
  private typeInterval: any = null;
  private currentFullText = '';
  private charIndex = 0;

  
  private typingAudio = new Audio('assets/sounds/dialogo.mp3'); 

  ngOnInit() { 
    this.typingAudio.loop = true; 
    this.startTyping(); 
  }
  
  ngOnDestroy() { 
    if (this.typeInterval) clearInterval(this.typeInterval); 
    this.pararAudio(); 
  }

  currentSlideData() { 
    return this.slides[this.currentSlideIndex()]; 
  }

  getBorderColor() {
    const type = this.currentSlideData().type;
    return type === 'miraberto' ? 'borda-miraberto' : type === 'ralapenha' ? 'borda-ralapenha' : 'borda-zeron';
  }

  getIconGlow() {
    const type = this.currentSlideData().type;
    return type === 'miraberto' ? 'glow-verde' : type === 'ralapenha' ? 'glow-rosa' : 'glow-azul';
  }

  getTextColor() {
    const type = this.currentSlideData().type;
    return type === 'miraberto' ? 'texto-verde' : type === 'ralapenha' ? 'texto-rosa' : 'texto-azul';
  }

  getImagePath() {
    const type = this.currentSlideData().type;
    switch (type) {
      case 'miraberto':
        return 'assets/images/miraberto.jpeg';
      case 'ralapenha':
        return 'assets/images/ralapenha.jpeg';
      case 'system':
        return 'assets/images/sisi.jpeg';
        case 'system2':
        return 'assets/images/sisi2.jpeg';
      default:
        return 'assets/images/zero.jpeg';
    }
  }

  private pararAudio() {
    this.typingAudio.pause();
    this.typingAudio.currentTime = 0; 
  }

  startTyping() {
    if (this.typeInterval) clearInterval(this.typeInterval);
    this.displayedText.set('');
    this.isTypingDone.set(false);
    this.charIndex = 0;
    this.currentFullText = this.currentSlideData().text;

    
    this.typingAudio.play().catch(e => {
      
    });

    this.typeInterval = setInterval(() => {
      if (this.charIndex < this.currentFullText.length) {
        this.displayedText.set(this.currentFullText.substring(0, this.charIndex + 1));
        this.charIndex++;
      } else {
        this.isTypingDone.set(true);
        clearInterval(this.typeInterval);
        this.pararAudio(); 
      }
    }, 30);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.advance();
    }
  }

  advance() {
    if (!this.isTypingDone()) {
      
      clearInterval(this.typeInterval);
      this.displayedText.set(this.currentFullText);
      this.isTypingDone.set(true);
      this.pararAudio();
    } else {
      if (this.currentSlideIndex() < this.slides.length - 1) {
        this.currentSlideIndex.set(this.currentSlideIndex() + 1);
        this.startTyping();
      } else {
        this.finishIntro();
      }
    }
  }

  skipIntro(event: Event) {
    event.stopPropagation();
    this.finishIntro();
  }

  finishIntro() {
    this.pararAudio();
    this.loadingService.adicionarItemLoading('carregando-mapa');
    setTimeout(() => {
      this.loadingService.removerItemLoading('carregando-mapa');
      this.router.navigate(['/story/map']);
    }, 2000);
  }
}