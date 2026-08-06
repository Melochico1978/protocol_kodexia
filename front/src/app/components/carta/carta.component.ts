import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Carta } from '../../models/carta.model'; 
import { CartaTrunfo } from './shared/carta.interface'; 

interface LanguageDetails {
  tipo: string;
  descricao: string;
  atributoEspecial: string;
}

const LINGUAGENS_INFO: Record<string, LanguageDetails> = {
  'PYTHON': {
    tipo: 'IA / SCRIPT',
    descricao: 'CÓDIGO DE ALTA ABSTRAÇÃO | Domina redes neurais e scripts automatizados com legibilidade insuperável.',
    atributoEspecial: 'PYTHON SPEED'
  },
  'JAVASCRIPT': {
    tipo: 'WEB / DINÂMICO',
    descricao: 'MOTOR DOS NAVEGADORES | Executa em qualquer máquina, conectando a rede mundial em milissegundos.',
    atributoEspecial: 'DOM FLOW'
  },
  'TYPESCRIPT': {
    tipo: 'WEB / TIPADO',
    descricao: 'SEGURANÇA ESTRUTURAL | Superconjunto estrito que adiciona tipagem forte para dominar aplicações web massivas.',
    atributoEspecial: 'TYPE ENGINE'
  },
  'JAVA': {
    tipo: 'CORPORATIVO / OOP',
    descricao: 'MÁQUINA VIRTUAL GIGANTE | Portabilidade absoluta rodando bilhões de dispositivos corporativos com robustez severa.',
    atributoEspecial: 'JVM POWER'
  },
  'C#': {
    tipo: 'ENTERPRISE / GAME',
    descricao: 'ECOSSISTEMA INTEGRADO | Versátil e poderoso, comanda jogos em 3D e sistemas corporativos complexos.',
    atributoEspecial: 'DOTNET PULSE'
  },
  'C++': {
    tipo: 'SISTEMAS / PERFORMANCE',
    descricao: 'PODER ABSOLUTO | Controle total de hardware e memória para aplicações que exigem velocidade extrema.',
    atributoEspecial: 'MEMORY CONTROL'
  },
  'C': {
    tipo: 'BAIXO NÍVEL / SISTEMAS',
    descricao: 'A BASE DE TUDO | A linguagem mãe que conversa direto com o silício e governa os sistemas operacionais.',
    atributoEspecial: 'HARDWARE LINK'
  },
  'GO': {
    tipo: 'NUVEM / CONCORRENTE',
    descricao: 'SIMPLICIDADE VELOZ | Criado para a era da nuvem, gerencia milhares de threads paralelas sem esforço.',
    atributoEspecial: 'GOROUTINE SYNC'
  },
  'RUST': {
    tipo: 'SISTEMAS / SEGURO',
    descricao: 'GARANTIA DE MEMÓRIA | Compilação ultra segura sem garbage collector para evitar vazamentos de dados.',
    atributoEspecial: 'BORROW CHECKER'
  },
  'KOTLIN': {
    tipo: 'MOBILE / MODERNO',
    descricao: 'CÓDIGO CONCISO | Linguagem oficial do ecossistema Android, combinando o melhor do paradigma funcional e OOP.',
    atributoEspecial: 'ANDROID CORE'
  },
  'SWIFT': {
    tipo: 'MOBILE / IOS',
    descricao: 'DESIGN ELEGANTE | Rápida e intuitiva, controla o ecossistema Apple com performance de ponta e segurança de memória.',
    atributoEspecial: 'APPLE METAL'
  },
  'PHP': {
    tipo: 'WEB / SERVIDOR',
    descricao: 'ARQUITETURA BACKEND | O motor por trás de grande parte da web mundial, ideal para renderização dinâmica rápida.',
    atributoEspecial: 'SERVER SCRIPT'
  },
  'DART': {
    tipo: 'MOBILE / MULTIPLATAFORMA',
    descricao: 'UNIVERSALIDADE UI | Alimenta o framework Flutter para desenhar interfaces nativas idênticas em qualquer tela.',
    atributoEspecial: 'FLUTTER ENGINE'
  },
  'RUBY': {
    tipo: 'WEB / PRODUTIVIDADE',
    descricao: 'FELICIDADE DO DEV | Sintaxe limpa e focada em simplicidade, famosa por impulsionar startups com velocidade ágil.',
    atributoEspecial: 'GEMS STREAM'
  },
  'MATLAB': {
    tipo: 'CÁLCULO / CIENTÍFICO',
    descricao: 'MATRIZES COMPLEXAS | Projetada para engenheiros e cientistas simularem sistemas físicos e cálculos numéricos pesados.',
    atributoEspecial: 'MATH MATRIX'
  },
  'SCALA': {
    tipo: 'FUNCIONAL / JVM',
    descricao: 'OOP ENCONTRA FUNCIONAL | Integração perfeita com Java trazendo tipagem estática avançada para big data.',
    atributoEspecial: 'SPARK STREAM'
  },
  'R': {
    tipo: 'ESTATÍSTICA / DADOS',
    descricao: 'ANÁLISE PROFUNDA | Preferida por analistas e cientistas de dados para computação estatística e gráficos avançados.',
    atributoEspecial: 'DATA VECTOR'
  },
  'ELIXIR': {
    tipo: 'CONCORRÊNCIA / FUNCIONAL',
    descricao: 'TOLERÂNCIA A FALHAS | Roda sobre a máquina virtual Erlang (BEAM) para criar sistemas distribuídos indestrutíveis.',
    atributoEspecial: 'OTP ACTOR'
  },
  'HASKELL': {
    tipo: 'FUNCIONAL PURO',
    descricao: 'ABSTRAÇÃO MATEMÁTICA | Sem efeitos colaterais e com avaliação preguiçosa (lazy evaluation) para estabilidade extrema.',
    atributoEspecial: 'MONAD BIND'
  },
  'JULIA': {
    tipo: 'COMPUTAÇÃO CIENTÍFICA',
    descricao: 'VELOCIDADE C E SINTAXE PYTHON | Otimizada para computação de alta performance e aprendizado de máquina.',
    atributoEspecial: 'JIT ENGINE'
  },
  'GROOVY': {
    tipo: 'TECH-MUSIC HYBRID',
    descricao: 'RITMO CIBERNÉTICO | Sintaxe ágil e dinâmica sobre a JVM para integrar e automatizar redes com fluidez musical.',
    atributoEspecial: 'GROOVY FLOW'
  },
  'LUA': {
    tipo: 'SCRIPT / EXTENSÍVEL',
    descricao: 'LEVE E INTEGRÁVEL | A linguagem de script mais rápida do mundo, largamente utilizada para modding e games.',
    atributoEspecial: 'TABLE KEY'
  },
  'ZIG': {
    tipo: 'SISTEMAS / MODERNO',
    descricao: 'SUBSTITUTO DIRETO DO C | Compilador robusto e sem comportamento indefinido para gerenciar recursos manualmente.',
    atributoEspecial: 'COMPTIME RUN'
  },
  'NIM': {
    tipo: 'SISTEMAS / EXPRESSIVO',
    descricao: 'SINTAXE PYTHON COM PERFORMANCE C | Compila diretamente para C/C++ gerando binários minúsculos e ultra velozes.',
    atributoEspecial: 'MACRO POWER'
  },
  'CRYSTAL': {
    tipo: 'SISTEMAS / PRODUTIVIDADE',
    descricao: 'RÁPIDO COMO C, LINDO COMO RUBY | Tipagem estática implícita com checagem em tempo de compilação sem complicação.',
    atributoEspecial: 'LLVM BYTE'
  },
  'V (VLANG)': {
    tipo: 'SISTEMAS / RÁPIDO',
    descricao: 'COMPILAÇÃO INSTANTÂNEA | Linguagem simples que traduz código para C limpo em menos de um segundo.',
    atributoEspecial: 'AUTOFREE BUFFER'
  },
  'F#': {
    tipo: 'FUNCIONAL / .NET',
    descricao: 'FUNCIONAL CORPORATIVO | Linguagem funcional poderosa integrada à plataforma .NET para soluções robustas.',
    atributoEspecial: 'PIPE STREAM'
  }
};

@Component({
  selector: 'app-carta',
  templateUrl: './carta.component.html',
  styleUrls: ['./carta.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CartaComponent implements OnInit, OnChanges {
  
  @Input() cartaInput!: Carta;
  
  carta!: CartaTrunfo;

  // Propriedades dinâmicas para o visual estilo Groovy.png
  nivel: number = 1;
  tipo: string = 'SISTEMAS';
  raridade: string = 'COMUM';
  descricao: string = 'ENTIDADE DE DADOS DO TERMINAL KODEXIA';
  poder: number = 0;
  nomeAtributoEspecial: string = 'KODEX FLOW';
  valorAtributoEspecial: number = 0;

  ngOnInit() {
    this.atualizarDesign();
  }

  ngOnChanges() {
    this.atualizarDesign();
  }

  private obterInfoLinguagem(nome: string, lendaria: boolean): { tipo: string; descricao: string; nomeAtributoEspecial: string } {
    const nomeNormalizado = nome.trim().toUpperCase();
    let info = LINGUAGENS_INFO[nomeNormalizado];

    if (!info) {
      const keyMatch = Object.keys(LINGUAGENS_INFO).find(k => nomeNormalizado.includes(k) || k.includes(nomeNormalizado));
      if (keyMatch) {
        info = LINGUAGENS_INFO[keyMatch];
      }
    }

    if (info) {
      return {
        tipo: info.tipo,
        descricao: info.descricao,
        nomeAtributoEspecial: info.atributoEspecial
      };
    }

    return {
      tipo: lendaria ? 'LENDÁRIA / CORROMPIDA' : 'CYBER CUSTOM',
      descricao: `CÓDIGO DE DADOS CUSTOMIZADO | Identidade de dados registrada localmente no terminal principal da Kodexia.`,
      nomeAtributoEspecial: `${nomeNormalizado.replace(/[^a-zA-Z]/g, '') || 'KODEX'} FLOW`
    };
  }

  private calcularRaridade(media: number, lendaria: boolean): string {
    if (lendaria) return 'LENDÁRIA';
    if (media >= 88) return 'ULTRA RARA';
    if (media >= 76) return 'RARA';
    if (media >= 60) return 'INCOMUM';
    return 'COMUM';
  }

  atualizarDesign() {
    if (this.cartaInput) {
      const info = this.obterInfoLinguagem(this.cartaInput.nome, this.cartaInput.lendaria);
      this.tipo = info.tipo;
      this.descricao = info.descricao;
      this.nomeAtributoEspecial = info.nomeAtributoEspecial;

      // Cálculos matemáticos baseados nos atributos reais
      const totalAtributos = 
        this.cartaInput.performance + 
        this.cartaInput.sintaxe + 
        this.cartaInput.seguranca + 
        this.cartaInput.longevidade + 
        this.cartaInput.popularidade + 
        this.cartaInput.abstracao + 
        this.cartaInput.versatilidade;
      
      const media = totalAtributos / 7;
      
      // Nível de 1 a 10 baseado na média
      this.nivel = Math.max(1, Math.min(10, Math.round(media / 10)));

      // Raridade
      this.raridade = this.calcularRaridade(media, this.cartaInput.lendaria);

      // Poder e Atributo Especial
      this.poder = Math.round((this.cartaInput.performance * 0.4 + this.cartaInput.seguranca * 0.4 + this.cartaInput.popularidade * 0.2) * 100);
      this.valorAtributoEspecial = Math.round((this.cartaInput.versatilidade * 0.4 + this.cartaInput.sintaxe * 0.4 + this.cartaInput.longevidade * 0.2) * 100);

      this.carta = {
        codigo: (this.cartaInput.grupo + '-' + this.cartaInput.codigo) as any,
        nome: this.cartaInput.nome.toUpperCase(),
        imagemUrl: this.getImagemUrl(),  
        isSuperTrunfo: this.cartaInput.lendaria,
        mensagemSuperTrunfo: 'ENTIDADE DE ALTO IMPACTO',
        atributos: [
          { nome: 'PERFORMANCE', valor: this.cartaInput.performance },
          { nome: 'SINTAXE', valor: this.cartaInput.sintaxe },
          { nome: 'SEGURANÇA', valor: this.cartaInput.seguranca },
          { nome: 'LONGEVIDADE', valor: this.cartaInput.longevidade },
          { nome: 'POPULARIDADE', valor: this.cartaInput.popularidade },
          { nome: 'ABSTRAÇÃO', valor: this.cartaInput.abstracao },
          { nome: 'VERSATILIDADE', valor: this.cartaInput.versatilidade }
        ]
      };
    }
  }


  obterImagemFallback(nome: string | undefined): string {
    if (!nome) return '/assets/img/teste.jpg';
    const nomeLower = nome.trim().toLowerCase();

    const mapping: { [key: string]: string } = {
      'c#': '/assets/img/csharp.png',
      'csharp': '/assets/img/csharp.png',
      'c++': '/assets/img/cpp.png',
      'cpp': '/assets/img/cpp.png',
      'vlang': '/assets/img/vlang.svg',
      'v': '/assets/img/vlang.svg',
      'python': '/assets/img/python.png',
      'javascript': '/assets/img/javascript.png',
      'typescript': '/assets/img/typescript.png',
      'java': '/assets/img/java.png',
      'rust': '/assets/img/rust.png',
      'kotlin': '/assets/img/kotlin.png',
      'swift': '/assets/img/swift.png',
      'php': '/assets/img/php.png',
      'dart': '/assets/img/dart.png',
      'ruby': '/assets/img/ruby.svg',
      'matlab': '/assets/img/matlab.png',
      'scala': '/assets/img/scala.svg',
      'elixir': '/assets/img/elixir.png',
      'haskell': '/assets/img/haskell.png',
      'julia': '/assets/img/julia.png',
      'groovy': '/assets/img/groovy.png',
      'lua': '/assets/img/lua.png',
      'zig': '/assets/img/zig.svg',
      'nim': '/assets/img/nim.svg',
      'crystal': '/assets/img/crystal.png',
      'fsharp': '/assets/img/fsharp.png',
      'ada': '/assets/img/ada.png',
      'cobol': '/assets/img/cobol.png',
      'fortran': '/assets/img/fortran.png',
      'ocaml': '/assets/img/ocaml.svg',
      'assembly': '/assets/img/assembly.png',
      'go': '/assets/img/go.png',
      'cefet': '/assets/images/miraberto.jpeg'
    };

    for (const key of Object.keys(mapping)) {
      if (nomeLower.includes(key)) {
        return mapping[key];
      }
    }

    if (nomeLower === 'r') return '/assets/img/r.svg';

    return '/assets/img/teste.jpg';
  }

  getImagemUrl(): string {
    if (!this.cartaInput?.imagem) {
      return this.obterImagemFallback(this.cartaInput?.nome);
    }
    const path = this.cartaInput.imagem;
    return path.startsWith('/') ? path : '/' + path;
  }
}