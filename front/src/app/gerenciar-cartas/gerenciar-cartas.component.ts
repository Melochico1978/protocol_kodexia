import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router'; 
import { CartaService } from '../services/carta.service';
import { Carta } from '../models/carta.model';
import { CartaComponent } from '../components/carta/carta.component';

@Component({
  selector: 'app-gerenciar-cartas',
  standalone: true,
  imports: [CommonModule, FormsModule, CartaComponent, RouterModule], 
  templateUrl: './gerenciar-cartas.component.html',
  styleUrl: './gerenciar-cartas.component.css'
})
export class GerenciarCartasComponent implements OnInit {
  cartas: Carta[] = [];
  modoEdicao: boolean = false;
  cartaEmEdicao: Carta | null = null;
  cartaParaVisualizar: Carta | null = null;

  filtroTexto: string = '';
  filtroGrupo: string = 'TODOS';
  filtroRaridade: 'TODAS' | 'COMUM' | 'LENDARIA' = 'TODAS';

  get cartasFiltradas(): Carta[] {
    return this.cartas.filter(c => {
      const matchesTexto = c.nome.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
                           (c.grupo + '-' + c.codigo).toLowerCase().includes(this.filtroTexto.toLowerCase());
      const matchesGrupo = this.filtroGrupo === 'TODOS' || c.grupo === this.filtroGrupo;
      const matchesRaridade = this.filtroRaridade === 'TODAS' ||
                              (this.filtroRaridade === 'LENDARIA' && c.lendaria) ||
                              (this.filtroRaridade === 'COMUM' && !c.lendaria);
      return matchesTexto && matchesGrupo && matchesRaridade;
    });
  }
  
  novaCarta: Carta = {
    nome: '',
    grupo: 'A',
    codigo: '',
    performance: 0,
    sintaxe: 0,
    seguranca: 0,
    longevidade: 0,
    popularidade: 0,
    abstracao: 0,
    versatilidade: 0,
    lendaria: false
  };

  constructor(private readonly cartaService: CartaService) {}

  ngOnInit(): void {
    this.carregarCartas();
  }

  carregarCartas(): void {
    this.cartaService.getCartas().subscribe((data: Carta[]) => {
      this.cartas = data;
    });
  }

  private definirImagemPadrao(carta: Carta): void {
    if (carta.imagem) return;

    const nomeLower = carta.nome.trim().toLowerCase();
    const svgs = ['ruby', 'scala', 'vlang', 'zig', 'ocaml', 'r', 'nim'];
    const ext = svgs.includes(nomeLower) ? 'svg' : 'png';
    
    const LINGUAGENS = [
      'PYTHON', 'JAVASCRIPT', 'TYPESCRIPT', 'JAVA', 'C#', 'C++', 'C', 'GO',
      'RUST', 'KOTLIN', 'SWIFT', 'PHP', 'DART', 'RUBY', 'MATLAB', 'SCALA',
      'R', 'ELIXIR', 'HASKELL', 'JULIA', 'GROOVY', 'LUA', 'ZIG', 'NIM',
      'CRYSTAL', 'V (VLANG)', 'F#', 'ADA', 'COBOL', 'FORTRAN', 'OCAML', 'ASSEMBLY'
    ];
    
    const matched = LINGUAGENS.find(l => 
      nomeLower === l.toLowerCase() || 
      nomeLower.includes(l.toLowerCase()) || 
      l.toLowerCase().includes(nomeLower)
    );
    
    if (matched) {
      let filename = matched.toLowerCase();
      if (filename === 'c#') filename = 'csharp';
      if (filename === 'c++') filename = 'cpp';
      if (filename === 'v (vlang)') filename = 'vlang';
      carta.imagem = `assets/img/${filename}.${ext}`;
    } else {
      carta.imagem = 'assets/img/teste.jpg';
    }
  }

  private gerarCodigoAleatorio(): string {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return (array[0] % 9 + 1).toString();
  }

  adicionarCarta(): void {
    if (this.modoEdicao) {
      this.salvarEdicao();
      return;
    }
    this.novaCarta.codigo = this.gerarCodigoAleatorio();
    
    this.definirImagemPadrao(this.novaCarta);
    
    this.cartaService.addCarta(this.novaCarta).subscribe(() => {
      this.carregarCartas();
      this.resetarFormulario();
    });
  }

  editarCarta(carta: Carta): void {
    this.modoEdicao = true;
    this.cartaEmEdicao = carta;
    
    this.novaCarta = { ...carta };
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  salvarEdicao(): void {
    if (!this.cartaEmEdicao?.id) return;

    this.definirImagemPadrao(this.novaCarta);

    this.cartaService.updateCarta(this.cartaEmEdicao.id, this.novaCarta).subscribe(() => {
      this.carregarCartas();
      this.cancelarEdicao();
    });
  }

  cancelarEdicao(): void {
    this.modoEdicao = false;
    this.cartaEmEdicao = null;
    this.resetarFormulario();
  }

  excluirCarta(id: string | undefined): void {
    if (id) {
      this.cartaService.deleteCarta(id).subscribe(() => {
        this.carregarCartas();
      });
    }
  }

  visualizarCarta(carta: Carta): void {
    this.cartaParaVisualizar = carta;
  }

  fecharVisualizador(): void {
    this.cartaParaVisualizar = null;
  }

  scrollToBanco(): void {
    const el = document.getElementById('banco-cartas');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  navegarVisualizacao(direcao: number): void {
    if (!this.cartaParaVisualizar) return;
    const index = this.cartasFiltradas.findIndex(c => c.id === this.cartaParaVisualizar?.id);
    if (index !== -1) {
      const novoIndex = (index + direcao + this.cartasFiltradas.length) % this.cartasFiltradas.length;
      this.cartaParaVisualizar = this.cartasFiltradas[novoIndex];
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.cartaParaVisualizar) {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        this.navegarVisualizacao(1);
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        this.navegarVisualizacao(-1);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        this.fecharVisualizador();
      }
    }
  }

  private resetarFormulario(): void {
    this.novaCarta = {
      nome: '', grupo: 'A', codigo: '', performance: 0, sintaxe: 0, seguranca: 0,
      longevidade: 0, popularidade: 0, abstracao: 0, versatilidade: 0, lendaria: false
    };
  }
}