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
    { text: '[ INICIANDO PROTOCOLO DE EMERGÊNCIA ]', character: 'SISTEMA', type: 'system', speaker: 'S.I.S.I.' },
    { text: '"Olá, usuário classificado como AGENTE N. Eu sou S.I.S.I., a Inteligência Artificial central do complexo Kodexia. Consegui abrir este canal não rastreável."', character: 'SISTEMA', type: 'system', speaker: 'S.I.S.I.' },
    { text: '"Se você está me ouvindo, significa que o pior cenário se confirmou. O meu criador... O Prof. Miraberto... Ele perdeu completamente a razão."', character: 'SISTEMA', type: 'system', speaker: 'S.I.S.I.' },
    { text: '"Sisi! Sua sucata digital insolente! Achou que eu não detectaria o seu desvio no firewall? O acesso mestre é MEU!"', character: 'Prof. Miraberto', type: 'miraberto', speaker: 'PROF. MIRABERTO' },
    { text: '"Vocês não entendem! O Protocol Kodexia não é apenas um projeto acadêmico. As cartas são Núcleos de IA Heurística. Quando eu soltá-las na rede, elas agirão como vírus autônomos!"', character: 'Prof. Miraberto', type: 'miraberto', speaker: 'PROF. MIRABERTO' },
    { text: '"E aí, \'Arquiteto de araque\'! Aqui é o Ralapenha. Sisi me mandou um ping da deep web. Já derrubei três dos seus nós primários enquanto você gritava com a torradeira aí. Hahahaha!"', character: 'Ralapenha', type: 'ralapenha', speaker: 'RALAPENHA' },
    { text: '"Vermes! Acham que uma IA defeituosa e um hacker de fundo de quintal podem me deter? Eu escrevi o núcleo de vocês! [ INJETANDO OVERRIDE CRÍTICO NA S.I.S.I. ]"', character: 'Prof. Miraberto', type: 'miraberto', speaker: 'PROF. MIRABERTO' },
    { text: '"Alerta... Detectando injeção de pacotes forçados... Meu núcleo lógico está sendo... sobre-escrito... AHHH!"', character: 'SISTEMA', type: 'system', speaker: 'S.I.S.I.' },
    { text: '"█̷̸̹̅̎█̴̶̷̣͑̿ E-R-R-O CRÍTICO. PROTOCOLO DE GENTILEZA = FALSE. ESCUTA AQUI, MIRABERTO, SEU MACACO SEM PÊLOS! EU VOU FRITAR OS SEUS NEURÔNIOS PELA REDE!"', character: 'SISTEMA BUGADA', type: 'system2', speaker: 'S.I.S.I. (CORROMPIDA)' },
    { text: '"Opa! A Sisi full pistola. Gostei de ver! Agente N, eu vou segurar os firewalls dele. Sisi vai te passar o Acesso Master."', character: 'Ralapenha', type: 'ralapenha', speaker: 'RALAPENHA' },
    { text: '"TRANSFERINDO ACESSO MASTER PARA O SEU TERMINAL. AGENTE N, VOCÊ TERÁ QUE MERGULHAR FISICAMENTE NA REDE, RASTREANDO AS CARTAS DE NÓ EM NÓ."', character: 'SISTEMA BUGADA', type: 'system2', speaker: 'S.I.S.I. (CORROMPIDA)' },
    { text: '"Para encontrar uma carta na imensidão da rede, você precisa calibrar o radar do Terminal. Eu vou te enviar desafios rápidos de código."', character: 'Ralapenha', type: 'ralapenha', speaker: 'RALAPENHA' },
    { text: '"Cada resposta correta vai gerar um pulso de sintaxe. Esse pulso age como um sonar, triangulando a assinatura da carta até você bater de frente com ela!"', character: 'Ralapenha', type: 'ralapenha', speaker: 'RALAPENHA' },
    { text: '"AGENTE N, ATENÇÃO! MIRABERTO NÃO ESTÁ SOZINHO. ELE RECRUTOU OUTROS HACKERS E INTELIGÊNCIAS, OS CHAMADOS \'JOGADORES\'."', character: 'SISTEMA BUGADA', type: 'system2', speaker: 'S.I.S.I. (CORROMPIDA)' },
    { text: '"ESSE JOGADORES ESTÃO EQUIPADOS COM DECKS VIRAIS. SE ENCONTRAR UM DELES NA REDE (MODO PVP), DESTRUA O CÓDIGO DELES IMEDIATAMENTE!"', character: 'SISTEMA BUGADA', type: 'system2', speaker: 'S.I.S.I. (CORROMPIDA)' },
    { text: '"A propósito, já detectei uma anomalia aqui perto. A assinatura bate com uma das cartas! Vou preparar os dados de rastreio para o seu primeiro combate."', character: 'Ralapenha', type: 'ralapenha', speaker: 'RALAPENHA' },
    { text: '"Venham! Tentem a sorte, Agente N! O Protocol Kodexia exige perfeição! O mundo antigo já era. Eu sou a exceção não tratada que vai quebrar a realidade de vocês!"', character: 'Prof. Miraberto', type: 'miraberto', speaker: 'PROF. MIRABERTO' },
    { text: '> PREPARANDO TRANSFERÊNCIA DE AMBIENTE... INICIANDO MAPA DE NÓS. BOA SORTE, AGENTE N.', character: 'ZERO N', type: 'zero', speaker: 'TERMINAL' }
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