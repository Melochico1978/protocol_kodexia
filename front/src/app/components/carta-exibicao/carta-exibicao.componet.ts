import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Carta } from '../../models/carta.model';

@Component({
  selector: 'app-carta-exibicao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carta-exibicao.component.html',
  styleUrl: './carta-exibicao.component.css'
})
export class CartaExibicaoComponent {
  @Input({ required: true }) carta!: Carta;

  getBarWidth(nota: number): string {
    return (nota * 10) + '%';
  }

  obterImagemFallback(nome: string | undefined): string {
    if (!nome) return '/assets/img/teste.jpg';
    const nomeLower = nome.trim().toLowerCase();
    const svgs = ['ruby', 'scala', 'vlang', 'zig', 'ocaml', 'r', 'nim'];
    const ext = svgs.includes(nomeLower) ? 'svg' : 'png';
    
    let filename = nomeLower;
    if (filename.includes('c#') || filename.includes('csharp')) return '/assets/img/csharp.png';
    if (filename.includes('c++') || filename.includes('cpp')) return '/assets/img/cpp.png';
    if (filename.includes('vlang') || filename === 'v') return '/assets/img/vlang.svg';
    if (filename.includes('python')) return '/assets/img/python.png';
    if (filename.includes('javascript')) return '/assets/img/javascript.png';
    if (filename.includes('typescript')) return '/assets/img/typescript.png';
    if (filename.includes('java')) return '/assets/img/java.png';
    if (filename.includes('rust')) return '/assets/img/rust.png';
    if (filename.includes('kotlin')) return '/assets/img/kotlin.png';
    if (filename.includes('swift')) return '/assets/img/swift.png';
    if (filename.includes('php')) return '/assets/img/php.png';
    if (filename.includes('dart')) return '/assets/img/dart.png';
    if (filename.includes('ruby')) return '/assets/img/ruby.svg';
    if (filename.includes('matlab')) return '/assets/img/matlab.png';
    if (filename.includes('scala')) return '/assets/img/scala.svg';
    if (filename.includes('elixir')) return '/assets/img/elixir.png';
    if (filename.includes('haskell')) return '/assets/img/haskell.png';
    if (filename.includes('julia')) return '/assets/img/julia.png';
    if (filename.includes('groovy')) return '/assets/img/groovy.png';
    if (filename.includes('lua')) return '/assets/img/lua.png';
    if (filename.includes('zig')) return '/assets/img/zig.svg';
    if (filename.includes('nim')) return '/assets/img/nim.svg';
    if (filename.includes('crystal')) return '/assets/img/crystal.png';
    if (filename.includes('fsharp')) return '/assets/img/fsharp.png';
    if (filename.includes('ada')) return '/assets/img/ada.png';
    if (filename.includes('cobol')) return '/assets/img/cobol.png';
    if (filename.includes('fortran')) return '/assets/img/fortran.png';
    if (filename.includes('ocaml')) return '/assets/img/ocaml.svg';
    if (filename === 'r') return '/assets/img/r.svg';
    if (filename === 'v') return '/assets/img/vlang.svg';
    if (filename.includes('assembly')) return '/assets/img/assembly.png';
    if (filename.includes('go')) return '/assets/img/go.png';
    if (filename.includes('cefet')) return '/assets/images/miraberto.jpeg';
    
    return '/assets/img/teste.jpg';
  }

  getImagemUrl(): string {
    if (!this.carta || !this.carta.imagem) {
      return this.obterImagemFallback(this.carta?.nome);
    }
    const path = this.carta.imagem;
    return path.startsWith('/') ? path : '/' + path;
  }
}