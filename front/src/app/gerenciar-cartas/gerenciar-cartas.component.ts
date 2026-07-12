import { Component, OnInit } from '@angular/core';
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

  constructor(private cartaService: CartaService) {}

  ngOnInit(): void {
    this.carregarCartas();
  }

  carregarCartas(): void {
    this.cartaService.getCartas().subscribe((data: Carta[]) => {
      this.cartas = data;
    });
  }

  adicionarCarta(): void {
    if (this.modoEdicao) {
      this.salvarEdicao();
      return;
    }
    this.novaCarta.codigo = Math.floor(1 + Math.random() * 9).toString();
    
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

  private resetarFormulario(): void {
    this.novaCarta = {
      nome: '', grupo: 'A', codigo: '', performance: 0, sintaxe: 0, seguranca: 0,
      longevidade: 0, popularidade: 0, abstracao: 0, versatilidade: 0, lendaria: false
    };
  }
}