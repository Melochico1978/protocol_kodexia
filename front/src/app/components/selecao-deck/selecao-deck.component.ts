import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 

import { CartaService } from '../../services/carta.service';
import { Carta } from '../../models/carta.model';
import { CartaComponent } from '../carta/carta.component';

@Component({
  selector: 'app-selecao-deck',
  standalone: true,
  imports: [CommonModule, FormsModule, CartaComponent],
  templateUrl: './selecao-deck.component.html',
  styleUrl: './selecao-deck.component.css'
})
export class SelecaoDeckComponent implements OnInit {
  todasCartas: Carta[] = [];
  cartasFiltradas: Carta[] = [];
  deckAtual: Carta[] = [];
  
  filtroGrupo: string = 'TODOS';
  
  // ALFABETO COMPLETO ADICIONADO AQUI:
  grupos: string[] = [
    'TODOS', 
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ];

  constructor(
    private cartaService: CartaService, 
    private location: Location 
  ) {}

  ngOnInit(): void {
    this.carregarCartas();
  }

  carregarCartas(): void {
    this.cartaService.getCartas().subscribe((data: Carta[]) => {
      this.todasCartas = data;
      
      const deckSalvo = this.cartaService.getDeck();
      
      this.deckAtual = [];
      this.todasCartas.forEach(c => {
        const taNoDeck = !!deckSalvo.find((salva: Carta) => salva.id === c.id);
        (c as any).selecionada = taNoDeck;
        if (taNoDeck) this.deckAtual.push(c);
      });

      this.filtrarCartas(this.filtroGrupo);
    });
  }

  filtrarCartas(grupo: string): void {
    this.filtroGrupo = grupo;
    if (grupo === 'TODOS') {
      this.cartasFiltradas = [...this.todasCartas];
    } else {
      this.cartasFiltradas = this.todasCartas.filter(c => c.grupo === grupo);
    }
  }

  toggleSelecao(carta: any): void {
    carta.selecionada = !carta.selecionada;
    
    if (carta.selecionada) {
      this.deckAtual.push(carta);
    } else {
      this.deckAtual = this.deckAtual.filter((c: any) => c.id !== carta.id);
    }
  }

  limparDeck(): void {
    this.todasCartas.forEach((c: any) => c.selecionada = false);
    this.deckAtual = [];
  }

  salvarDeck(): void {
    if (this.deckAtual.length < 8 || this.deckAtual.length % 2 !== 0) {
      alert('ACESSO NEGADO: O deck deve ter no mínimo 8 cartas e uma quantidade PAR!');
      return;
    }
    
    this.cartaService.setDeck(this.deckAtual);
    alert('✅ DECK SALVO COM SUCESSO! Você já pode iniciar o Duelo.');
  }

  voltar(): void {
    this.location.back(); 
  }
}